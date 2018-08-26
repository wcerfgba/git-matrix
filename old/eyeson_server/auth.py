from db import DB

class Auth:
  def __init__(self):
    self.db = DB()
  
  def enticate(self, auth):
    client_secret = self.db.get_secret_for(client_id=auth['id'])
    
    if auth['secret'] == client_secret:
      return True
    
    return False