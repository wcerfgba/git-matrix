CREATE TABLE clients (
  id                uuid          PRIMARY KEY,
  shared_secret     text          NOT NULL
  --time              timestamptz   NOT NULL
  -- HACK: We need this for UNIQUE in TimescaleDB but it's irrelevant.
);

CREATE TABLE snapshots (
  id              uuid          PRIMARY KEY,
  project_name    text          NOT NULL,
  file_path       text          NOT NULL,
  time            timestamptz   NOT NULL,
  client_id       uuid          NOT NULL        REFERENCES clients(id),
  snapshot        text          NOT NULL
);

CREATE TYPE event AS ENUM (
  'file-visible-start',
  'file-visible-end',
  'file-scroll-start',
  'file-scroll-end',
  'cursor-position-set'
);

CREATE TABLE events (
  time                  timestamptz   NOT NULL,
  client_id             uuid          NOT NULL    REFERENCES clients(id),
  session_id            uuid          NOT NULL,
  snapshot_id           uuid          NOT NULL    REFERENCES snapshots(id),
  event_type            event         NOT NULL,

  file_visible_top_line       integer,
  file_visible_bottom_line    integer,

  file_scroll_top_line        integer,
  file_scroll_bottom_line     integer,

  cursor_position_line        integer
);
SELECT create_hypertable('events', 'time');