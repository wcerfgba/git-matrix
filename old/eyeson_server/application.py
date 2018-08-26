from db import DB, DatabaseError
from auth import Auth
from util import error
import logging

class Application:
  def __init__(self):
    self.logger = logging.getLogger('application')
    self.db = DB()
    self.auth = Auth()

  def post_events(self,
                  auth = None,
                  session = None,
                  snapshots = None,
                  events = None):
    self.logger.info('Application.post_events(client = %s, session = %s)', auth.get(id), session)
    self.logger.debug('snapshots = %s', snapshots)
    self.logger.debug('events = %s', events)

    authed = self.auth.enticate(auth)
    if not authed:
      self.logger.info('Auth failure.')
      return {
        'err': 'Auth failure.'
      }

    try:
      posted_snapshots = self.db.post_snapshots(client = auth['id'],
                                                session = session,
                                                snapshots = snapshots)
      events = [ {
        **event, 
        'snapshot_id': posted_snapshots[event['snapshot']]
      } for event in events ]

      posted_events = self.db.post_events(client = auth['id'],
                                          session = session,
                                          events = events)
      self.db.commit()
      self.logger.info('Success.')
      return {
        'res': 'Success'
      }
    except DatabaseError as e:
      self.db.rollback()
      self.logger.error(e)
      return {
        'err': e
      }