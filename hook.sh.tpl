#!/bin/bash

FILENAME="$(basename "$0")"
GIT_HOOKS_DIR="${GIT_HOOKS_DIR:=$(pwd)/hooks}"
GIT_HOOK_PATH="$GIT_HOOKS_DIR/$FILENAME"
PATH={{PATH}}

if [ -f "$GIT_HOOK_PATH" ]; then
  echo "> $GIT_HOOK_PATH exists, running"
  echo ""
  $GIT_HOOK_PATH $@
fi
