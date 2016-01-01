#!/bin/bash

FILENAME="$(basename "$0")"
GIT_HOOKS_DIR="${GIT_HOOKS_DIR:=$(pwd)/hooks/}"
GIT_HOOK_DIR="$GIT_HOOKS_DIR/$FILENAME"
PATH={{PATH}}

if [ -f "$HOOK_DIR" ]; then
  GIT_echo "> $GIT_HOOKS_DIR exists, running"
  echo ""
  $GIT_HOOK_DIR
fi
