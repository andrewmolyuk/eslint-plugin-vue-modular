@PHONY: lint install test update release


install:
	npm install


lint:
	npx markdownlint README.md


test:
	npm test


update:
	npx npm-check-updates -u
	npm install

release:
	npx standard-version
	git push --follow-tags
	gh release create $(shell git describe --tags --abbrev=0) --notes-file CHANGELOG.md
