#!/bin/bash

set -e

if [ "$(git rev-parse --abbrev-ref HEAD)" == "main" ]; then
  echo "You are on the main branch, please switch to another branch"
  exit 1
fi

yarn nx release --skip-publish
