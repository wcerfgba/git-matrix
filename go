#!/bin/bash

#trap "trap - SIGTERM && kill -- -$$" SIGINT SIGTERM EXIT

case $1 in
    watch)
        (cd common && yarn watch) &
        (cd server && yarn watch) &
        (cd client/vscode && yarn watch) &
        ;;
    build)
        (cd common && yarn build)
        (cd server && yarn build)
        (cd client/vscode && yarn build)
        ;;
esac
