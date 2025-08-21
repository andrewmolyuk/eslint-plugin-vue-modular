@PHONY: lint install test update release update-meta

install:
	npm install

lint:
	npx eslint . --ext .js,.vue --fix
	npx markdownlint README.md

test:
	npx vitest

update:
	npx npm-check-updates -u
	npm install

release:
	npx standard-version
# Update meta.js with new version and name from package.json
	@VERSION=$$(node -p "require('./package.json').version"); \
	NAME=$$(node -p "require('./package.json').name"); \
	sed -i "s/version: '[^']*'/version: '$$VERSION'/g" src/meta.js; \
	sed -i "s/name: '[^']*'/name: '$$NAME'/g" src/meta.js; \
	echo "Updated meta.js with version $$VERSION and name $$NAME"
	git add src/meta.js
	git commit --amend --no-edit
# Move the tag to point to the amended commit because the commit hash has changed
	@TAG=$$(git describe --tags --abbrev=0); \
	git tag -d $$TAG; \
	git tag $$TAG
	git push --follow-tags --force-with-lease
	gh release create $(shell git describe --tags --abbrev=0) --notes-file CHANGELOG.md
