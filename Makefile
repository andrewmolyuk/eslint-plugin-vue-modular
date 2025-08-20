@PHONY: lint, install, update

install:
	npm install

lint:
	npx markdownlint README.md

update:
	npx npm-check-updates -u
	npm install
