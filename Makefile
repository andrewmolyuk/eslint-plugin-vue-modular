@PHONY: lint, install, test, update

install:
	npm install

lint:
	npx markdownlint README.md

test:
	npm test

update:
	npx npm-check-updates -u
	npm install
