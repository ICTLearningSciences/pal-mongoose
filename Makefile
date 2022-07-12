LICENSE_CONFIG?="license-config.json"

.PHONY: clean
clean:
	rm -rf node_modules

.PHONY: format
format: node_modules/prettier
	npm run format

node_modules/mocha:
	npm ci

node_modules/prettier:
	npm ci

node_modules/eslint:
	npm ci

.PHONY: test
test: node_modules/mocha
	export NODE_PATH=$(shell pwd)/lib \
	&& npm test

.PHONY: test-all
test-all: test-audit test-format test-lint test-license test

PHONY: test-audit
test-audit:
	npm run test:audit

.PHONY: test-format
test-format: node_modules/prettier
	npm run test:format

.PHONY: test-lint
test-lint: node_modules/eslint
	npm run test:lint

LICENSE:
	@echo "you must have a LICENSE file" 1>&2
	exit 1

.PHONY: license
license: LICENSE node_modules/license-check-and-add
	npm run license:fix

.PHONY: license-deploy
license-deploy: node_modules/license-check-and-add
	LICENSE_CONFIG=${LICENSE_CONFIG} npm run license:deploy

.PHONY: test-license
test-license: LICENSE node_modules/license-check-and-add
	npm run test:license

node_modules/license-check-and-add:
	npm ci
