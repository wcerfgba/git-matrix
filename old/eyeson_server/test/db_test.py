from support import *
from db import DB, DatabaseError



def test__DB__del():
    conn = Mock()
    logger = Mock()
    db = DB(conn = conn, logger = logger)

    del db

    conn.close.assert_called()



@given(st.uuids(), st.text())
def test__get_client_secret(client, expected_secret):
    logger = MockLogger()
    conn = MockConn()
    conn._cursor.fetchone = method(lambda _: (expected_secret,), conn._cursor)
    db = DB(conn = conn, logger = logger)

    expected_query = conn.cursor().mogrify("SELECT shared_secret FROM clients WHERE id = %s::uuid", (client,))

    secret = db.get_client_secret(client)
    
    assert secret == expected_secret
    assert db.logger.log == [
        "get_client_secret(client = {})".format(client),
        "query = {}".format(expected_query)
    ]

@given(st.uuids(), st.text())
def test__get_client_secret__psycopg2_error(client, error):
    error = psycopg2.Error()
    error.__setstate__({'pgerror': error})

    logger = MockLogger()
    conn = MockConn()
    conn._cursor.fetchone = method(lambda _: throw(error), conn._cursor)
    db = DB(conn = conn, logger = logger)

    expected_query = conn.cursor().mogrify("SELECT shared_secret FROM clients WHERE id = %s::uuid", (client,))

    with raises(DatabaseError):
        db.get_client_secret(client)
    
    assert db.logger.log == [
        "get_client_secret(client = {})".format(client),
        "query = {}".format(expected_query),
        "except psycopg2.Error",
        "e.pgerror = {}".format(error)
    ]



@given(st.uuids(), st.uuids(), snapshots())
def test__post_snapshots(client, session, snapshots):
    logger = MockLogger()
    conn = MockConn()
    #conn._cursor.fetchone = method(lambda _: (expected_secret,), conn._cursor)
    db = DB(conn = conn, logger = logger)

    expected_query = conn.cursor().mogrify("SELECT shared_secret FROM clients WHERE id = %s::uuid", (client,))

    secret = db.get_client_secret(client)
    
    assert secret == expected_secret
    assert db.logger.log == [
        "get_client_secret(client = {})".format(client),
        "query = {}".format(expected_query)
    ]



def snapshots():
    return st.lists(st.fixed_dictionaries({
        "project_name": st.text(),
        "file_path": st.text(),
        "time": st.datetimes().map(lambda datetime: datetime.isoformat()),
        "snapshot": st.text()
    }))
    