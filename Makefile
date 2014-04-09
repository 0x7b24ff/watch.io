NAME = Watch.IO
BASE_PATH = ./

all: clean build test

build:
	node build

test:
	mocha --reporter spec
	jshint $(BASE_PATH)lib/

clean:

.PHONY: all test clean
