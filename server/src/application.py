from db import DB
from auth import Auth
from util import error

class Application:
  def __init__(self):
    self.db = DB()
    self.auth = Auth()

  def post_events(self,
                  auth = None,
                  session = None,
                  snapshots = None,
                  events = None):
    authed = self.auth.enticate(auth)
    if error(authed):
      return {
        'err': 'Auth failure.'
      }

    posted_snapshots = self.db.post_snapshots(client = auth['id'],
                                              session = session,
                                              snapshots = snapshots)
    if error(posted_snapshots):
      self.db.rollback()
      return {
        'err': 'Failed to save snapshots.'
      }

    events = list(map(lambda event: {
      **event, 
      'snapshot_id': posted_snapshots[event['snapshot']]
    }, events))

    posted_events = self.db.post_events(client = auth['id'],
                                        session = session,
                                        events = events)

    if error(posted_events):
      self.db.rollback()
      return {
        'err': 'Failed to save events.'
      }
    
    self.db.commit()
    return {
      'res': 'Success'
    }