#!/bin/bash

mkdir -p eyeson-db-dev-psql-data/data

sudo docker run -d \
  --name eyeson-db-dev \
  -v "$(pwd)"/eyeson-db-dev-psql-data:/var/lib/postgresql \
  -p 5432:5432 \
  timescale/timescaledb:latest-pg10