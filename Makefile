IND_MAKE=docker compose run --build --entrypoint /usr/bin/env --remove-orphans --rm nodejs18 make
COMPOSE_DOWN=docker compose down --remove-orphans

.PHONY: all envfile _envfile deps _deps build _build test _test clean _clean

all:

envfile: _envfile
_envfile:
	touch .env.local

deps:
	${IND_MAKE} _deps
	${COMPOSE_DOWN}
_deps:
	npm install --from-lock-file

build:
	${IND_MAKE} _build
	${COMPOSE_DOWN}
_build: _deps
	npm run build

test:
	${IND_MAKE} _test
	${COMPOSE_DOWN}
_test: _envfile _deps
	npm run test

clean:
	${IND_MAKE} _clean
	${COMPOSE_DOWN}
_clean:
	npm run clean
	rm -fr node_modules
