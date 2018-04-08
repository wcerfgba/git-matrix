from unittest import TestCase
from unittest.mock import Mock, call
from hypothesis import given
from hypothesis.strategies import text

from db import DB 

class TestDBGetSecretFor(TestCase):
    #@given(text(), text())
    def test_valid_user_correct_secret(self):
        client_id = '123123'
        expected_secret = 'asdasdas'
        logger = MockLogger()
        db = buildDB(logger = logger, fetchone = expected_secret)
        secret = db.get_secret_for(client_id)
        assert secret == expected_secret
        assert logger.log == [
            'get_secret_for(client_id = 123123)'
        ]

def buildDB(**kwargs):
    logger = kwargs.pop('logger') or Mock()
    fetch_methods = kwargs
    conn = mockConn(**fetch_methods)
    db = DB(conn = conn, logger = logger)
    return db

def mockConn(**methods):
    cursor = Mock()
    for (method, value) in methods.items():
        method_mock = getattr(cursor, method)
        method_mock.return_value = (value,)
    conn = Mock()
    conn.cursor.return_value = cursor
    return conn

class MockLogger:
    def __init__(self):
        self.log = []
    
    def info(self, msg, *args):
        self.log.append(msg % args)
    
    def debug(self, msg, *args):
        self.log.append(msg % args)