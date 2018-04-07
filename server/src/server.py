from bottle import Bottle, run, post

app = Bottle()

@post('/events')
def hello():
    return "Hello World!"

run(app, host='localhost', port=3000)