#!/bin/bash

curl -XPOST \
     -H 'Content-Type:application/json' \
     -H 'Accept: application/json' \
     --data-binary @./fixtures/post_events_1.json \
     http://localhost:3000/events