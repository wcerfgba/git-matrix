#!/bin/sh
(
  mkdir -p ./test/fixtures/inputs ;
  cd ./test/fixtures/inputs ;
  git clone https://github.com/flowtype/flow-bin.git ;
  git clone https://github.com/vuetifyjs/vuetify.git
)
