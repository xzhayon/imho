_MAKE=.docker/run.sh workspace make

.PHONY: \
	all \
	envfile _envfile \
	deps _deps \
	build _build \
	test _test \
	release _release \
	clean _clean

all:

envfile: _envfile
_envfile .env.local:
	touch .env.local

deps: .env.local
	${_MAKE} _deps
_deps:
	npm install --from-lock-file

build: .env.local
	${_MAKE} _build
_build: _deps
	npm run build

test: .env.local
	${_MAKE} _test
_test: .env.local _deps
	npm test

release: .env.local
	${_MAKE} _release
_release: _deps
	npm run release

clean: .env.local
	${_MAKE} _clean
_clean:
	npm run clean
	rm -fr node_modules
