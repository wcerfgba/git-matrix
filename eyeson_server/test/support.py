from pytest import raises
from unittest import TestCase
from unittest.mock import Mock, call
from hypothesis import given
import hypothesis.strategies as st
import types

import psycopg2

class MockConn:
    def __init__(self):
        self._cursor = MockCursor()
    
    def cursor(self):
        return self._cursor
    
    def close(self):
        pass

class MockLogger:
    def __init__(self):
        self.log = []
    
    def _log(self, msg, *args):
      if len(args) == 0:
        args = [msg]
        msg = None
      
      if msg == None:
        msg = '{}'
      
      self.log.append(msg.format(*args))

    def info(self, msg, *args):
        self._log(msg, *args)
    
    def debug(self, msg, *args):
        self._log(msg, *args)
    
    def error(self, msg, *args):
        self._log(msg, *args)


class MockCursor:
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

def method(f, o):
  return types.MethodType(f, o)

def throw(e):
  (_ for _ in ()).throw(e)