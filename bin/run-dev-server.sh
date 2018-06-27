#!/usr/bin/env bash

# Get path to this directory
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

node --inspect ${DIR}/claudia-local-api $@
