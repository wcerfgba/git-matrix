CREATE TABLE clients (
  id                uuid          PRIMARY KEY,
  shared_secret     text          NOT NULL
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
  'file-open-start',
  'file-open-end',
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

  CONSTRAINT file_visible_start
  CHECK (event_type != 'file-visible-start' OR (
    file_visible_top_line     IS NOT NULL AND
    file_visible_bottom_line  IS NOT NULL
  )),


  file_scroll_top_line        integer,
  file_scroll_bottom_line     integer,

  CONSTRAINT file_scroll_start
  CHECK (event_type != 'file-scroll-start' OR (
    file_scroll_top_line     IS NOT NULL AND
    file_scroll_bottom_line  IS NOT NULL
  )),

  CONSTRAINT file_scroll_end
  CHECK (event_type != 'file-scroll-end' OR (
    file_scroll_top_line     IS NOT NULL AND
    file_scroll_bottom_line  IS NOT NULL
  )),


  cursor_position_line        integer,

  CONSTRAINT cursor_position_set
  CHECK (event_type != 'cursor-position-set' OR (
    cursor_position_line     IS NOT NULL
  ))
);
SELECT create_hypertable('events', 'time');