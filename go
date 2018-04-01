#!/bin/bash

(cd common && exec yarn $*) &
(cd server && exec yarn $*) &
(cd client/vscode && exec yarn $*) &

wait