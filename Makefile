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
	git push --follow-tags origin main
# Handle situation where GitHub CLI is not authenticated
	@if gh auth status >/dev/null 2>&1; then \
		TAG=$$(git describe --tags --abbrev=0); \
		if gh release view $$TAG >/dev/null 2>&1; then \
			echo "Release $$TAG already exists on GitHub"; \
		else \
			gh release create $$TAG --notes-file CHANGELOG.md; \
			echo "GitHub release $$TAG created successfully"; \
		fi; \
	else \
		echo "GitHub CLI not authenticated. Run 'gh auth login' to create releases automatically."; \
		echo "You can manually create a release at: https://github.com/andrewmolyuk/eslint-plugin-vue-modular/releases/new"; \
	fi
