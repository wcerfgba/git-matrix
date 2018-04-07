import psycopg2
import psycopg2.extras
import env
from util import uuid
import logging

logging.basicConfig(level=logging.DEBUG)

def events_extra_columns(events):
  extra_columns_by_event_type = {
    'file-visible-start':   ['file_visible_top_line', 'file_visible_bottom_line'],
    'file-visible-end':     [],
    'file-scroll-start':    ['file_scroll_top_line', 'file_scroll_bottom_line'],
    'file-scroll-end':      ['file_scroll_top_line', 'file_scroll_bottom_line'],
    'cursor-position-set':  ['cursor_position_line']
  }
  extra_columns = set()
  for event in events:
    extra_columns |= set(extra_columns_by_event_type[event['event_type']])
  return list(extra_columns)

def event_column_values(columns, event):
  extra_values = [ event.get(column, None) for column in columns ]
  return extra_values

class DB:
  def __init__(self):
    self.conn = psycopg2.connect(**env.db)
    self.logger = logging.getLogger('db')
  
  def __del__(self):
    self.conn.close()

  def get_secret_for(self, client_id = None):
    self.logger.info('DB.get_secret_for(%s, client_id = %s)', self, client_id)
    cur = self.conn.cursor()
    try:
      cur.execute("SELECT shared_secret FROM clients WHERE id = %s", (client_id,))
      secret = cur.fetchone()[0]
      cur.close()
      return secret
    except Exception as e:
      self.logger.error(e)
      return None

  def post_snapshots(self, client = None, session = None, snapshots = None):
    columns = [
      'id',
      'project_name',
      'file_path',
      'time',
      'client_id',
      'snapshot'
    ]
    rows = list(map(lambda snapshot: (uuid(),
                                       snapshot['project_name'],
                                       snapshot['file_path'],
                                       snapshot['time'],
                                       client,
                                       snapshot['snapshot']), snapshots))
    try:                                       
      cur = self.conn.cursor()
      query = f"INSERT INTO snapshots ({', '.join(columns)}) VALUES %s RETURNING id"
      psycopg2.extras.execute_values(cur, query, rows)
      ids = tuple(map(lambda r: r[0], cur.fetchall()))
      cur.close()
      return ids
    except Exception as e:
      self.logger.error(e)
      return None

  def post_events(self, client = None, session = None, events = None):
    self.logger.info('DB.post_events(%s, client = %s, session = %s, events = %s)', self, client, session, events)
    columns = [
      'time',
      'client_id',
      'session_id',
      'snapshot_id',
      'event_type'
    ]
    events_columns = events_extra_columns(events)
    rows = list(map(lambda event: (event['time'],
                                   client,
                                   session,
                                   event['snapshot_id'],
                                   event['event_type'],
                                   *event_column_values(events_columns, event)), events))
    self.logger.debug('rows = %s', rows)
    try:
      query_columns = ', '.join(columns + events_columns)
      cur = self.conn.cursor()
      query = f"INSERT INTO events ({query_columns}) VALUES %s"
      psycopg2.extras.execute_values(cur, query, rows)
      cur.close()
      return True
    except Exception as e:
      self.logger.error(e)
      return None

  def rollback(self):
    self.conn.rollback()

  def commit(self):
    self.conn.commit()
  