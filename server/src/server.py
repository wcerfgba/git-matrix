from bottle import Bottle, run, post, request
from application import Application
import json

server = Bottle()
app = Application()

@server.post('/events')
def post_events():
    req = request.json
    result = app.post_events(**req)
    res = json.dumps(result)
    return res
    
if __name__ == '__main__':
    run(server, host='localhost', port=3000)