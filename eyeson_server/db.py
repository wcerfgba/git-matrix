import psycopg2
import psycopg2.extras
import psycopg2.errorcodes
import env
from util import uuid
import logging

class DatabaseError(Exception):
    def __init__(self, cause):
      self.cause = cause

def events_extra_columns(events):
  extra_columns_by_event_type = {
    'file-open-start':      [],
    'file-open-end':        [],
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
  def __init__(self, **attrs):
    self.conn = attrs.get('conn', psycopg2.connect(**env.db))
    self.logger = attrs.get('logger', logging.getLogger('db'))
  
  def __del__(self):
    self.conn.close()

  def get_secret_for(self, client_id = None):
    print('qwe')
    self.logger.info('get_secret_for(client_id = %s)', client_id)
    cur = self.conn.cursor()
    print('qweqwe!')
    try:
      query = cur.mogrify("SELECT shared_secret FROM clients WHERE id = %s::uuid", (client_id,))
      self.logger.debug('query = %s', query)
      cur.execute(query)
      res = cur.fetchone()
      secret = res[0]
      return secret
    except psycopg2.Error as e:
      self.logger.error(e)
      raise DatabaseError(e)
    finally:
      cur.close()

  def post_snapshots(self, client = None, session = None, snapshots = None):
    self.logger.info('DB.post_snapshots(%s, client = %s, session = %s)', self, client, session)
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
    if len(rows) == 0:
      return []

    try:
      cur = self.conn.cursor()
      query = f"INSERT INTO snapshots ({', '.join(columns)}) VALUES %s RETURNING id"
      psycopg2.extras.execute_values(cur, query, rows)
      ids = []
      for row in cur.fetchall():
        ids.append(row[0])
      return ids
    except psycopg2.Error as e:
      self.logger.error(e)
      raise DatabaseError(e)
    finally:
      cur.close()

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
    query_columns = ', '.join(columns + events_columns)
    try:
      cur = self.conn.cursor()
      query = f"INSERT INTO events ({query_columns}) VALUES %s"
      psycopg2.extras.execute_values(cur, query, rows)
      return True
    except psycopg2.Error as e:
      self.logger.error(e)
      raise DatabaseError(e)
    finally:
      cur.close()

  def rollback(self):
    self.conn.rollback()

  def commit(self):
    self.conn.commit()
