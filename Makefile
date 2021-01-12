install:
	npm install

lint:
	npx eslint .

publish:
	npm publish --dry-run

test:
	npm test

link:
	npm link

test-coverage:
	npm test -- --coverage --coverageProvider=v8

.PHONY: test
