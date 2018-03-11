# eyeson - spike 0

Code Analytics as a Service

## Architecture

* `POST /events`
* `GET /statistics`
* WebSocket for live incoming events stream

## Events

In rough order of importance decreasing :grin: :

* File opened
* File closed
* Switched file
* File scrolled
* Editor lost focus
* Editor received focus
* Cursor moved
* Text inserted
* Text selected
* Copy
* Paste
* ...

## Example event payload

A rough schema:

```
event:

  # Context fields
  timestamp:      int       # <unix timestamp> | ...
  project:        str       # 'leads' | 'eyeson' | ...
  vcs-reference:  str       # <git commit hash> | <git branch name> | ...
  ...

  # Event type
  event:          str       # 'file-opened' | 'file-closed' | ...

  # Event fields
  ...
```

A real example:

```
event:
  timestamp:            1520456486
  project:              'eyeson'
  vcs-reference:        'master'
  event:                'text-inserted'
  file:                 'spike-0/README.txt'
  insertion-line:       50
  viewport-start-line:  18
  viewport-end-line:    56
```

Timestamp could be added by the server to prevent synchronisation issues, but 
probably only a low-granularity timestamp (minute) will be needed anyway. We can
code the client to normalise the datetime. We trust the client enough to send 
the event, they can timestamp it too.

## Statistics

* Proportion of time spent viewing this line over the last week [kinda...]

We need a measure of how much focus, attention, a line has received, weighted 
over time, and summed.

```
focusReceived file line =
  reduce (+) 0.0 (map (focusForEvent file line) allEvents) 

focusForEvent file line event@(TextInsertedEvent {})
  | file event /= file                  =   0.0
  | insertionLine event == line         =   1.0
  | viewportStartLine event <= line &&
    line <= viewportEndLine event       =   0.1
```