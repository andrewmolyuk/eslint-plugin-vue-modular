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
	@if gh auth status >/dev/null 2>&1; then \
		npx standard-version; \
		git push --follow-tags; \
		gh release create $$(git describe --tags --abbrev=0) --notes-file CHANGELOG.md; \
	else \
		echo "GitHub CLI not authenticated. Run 'gh auth login' to create releases automatically."; \
		echo "You can manually create a release at: https://github.com/andrewmolyuk/eslint-plugin-vue-modular/releases/new"; \
	fi
