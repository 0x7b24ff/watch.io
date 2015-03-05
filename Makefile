# Makefile

BASE = .

all: test

test:
	mocha --reporter spec
	jshint $(BASE)/lib/

.PHONY: all test
