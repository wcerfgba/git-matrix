from unittest import TestCase
from unittest.mock import Mock, call
from hypothesis import given
from hypothesis.strategies import text

from db import DB 




def buildDB(**fetch_methods):
    logger = MockLogger()
    conn = MockConn(**fetch_methods)
    db = DB(conn = conn, logger = logger)
    return db

class MockConn:
    def __init__(self, **methods):
        self._cursor = MockCursor(**methods)
    
    def cursor(self):
        return self._cursor
    
    def close(self):
        pass

class MockLogger:
    def __init__(self):
        self.log = []
    
    def info(self, msg, *args):
        self.log.append(msg % args)
    
    def debug(self, msg, *args):
        self.log.append(msg % args)


class MockCursor:
    def __init__(self, **methods):
        for (method, value) in methods.items():
            setattr(self, method, lambda: (value,))

    def close(self):
        pass

    def mogrify(self, str, *args):
        mogrified_args = map(
            lambda arg: psycopg2.extensions.adapt(arg).getquoted(),
            args
        )

        mogrified_string = str % args

        return mogrified_string

    def execute(self, str, *args):
        pass


# @given(text(), text())
# def test_get_secret(client, expected_secret):
def test_get_secret():
    client = 'qeqweqe'
    expected_secret = 'werfsdfsd'

    db = buildDB(fetchone = expected_secret)

    secret = db.get_client_secret(client)
    
    assert secret == expected_secret
    assert db.logger.log == [
        'get_client_secret(client = %s)' % client,
        "query = SELECT shared_secret FROM clients WHERE id = ('%s',)::uuid" % client
    ]

