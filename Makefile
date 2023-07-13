.PHONY: setup clean test run

all:

setup:
	touch .env.local
	./npm.sh install --from-lock-file

clean:
	./npm.sh run clean
	rm -fr node_modules

test: setup
	./npm.sh test

run: setup
