#!/bin/sh

npm install -g codeclimate-test-reporter
codeclimate-test-reporter < ./coverage/lcov.info