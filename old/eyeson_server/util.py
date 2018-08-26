import uuid as _uuid

def error(x):
  return (
    not x or
    (hasattr(x, 'get') and x.get('err', None) != None)
  )

def uuid():
  return str(_uuid.uuid4())