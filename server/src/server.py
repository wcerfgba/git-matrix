from bottle import Bottle, run, post, request, abort
from application import Application
import json
import logging

logging.basicConfig(level=logging.DEBUG)

logger = logging.getLogger('server')
server = Bottle()
app = Application()

@server.post('/events')
def post_events():
    try:
        req = request.json
        result = app.post_events(**req)
        res = json.dumps(result)
        return res
    except Exception as e:
        logger.error('%s\nRequest: %s', e, request.body().read())
        abort(500, json.dumps({ 'err': 'Internal Server Error' }))
        raise e
    
if __name__ == '__main__':
    run(server, host='localhost', port=3000)