#!/bin/bash

sudo docker volume create eyeson-pgdata

sudo docker run -d \
  --name eyeson-db-dev \
  -v eyeson:/var/lib/postgresql/data \
  -p 5432:5432 \
  timescale/timescaledb:latest-pg10