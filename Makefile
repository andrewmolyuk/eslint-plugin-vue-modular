@PHONY: lint install test update release drawio

install:
	npm install

lint:
	npx eslint . --ext .js,.vue --fix
	npx markdownlint README.md docs/**/*.md --fix

test: lint
	CI=CI npx vitest

update:
	npx npm-check-updates -u
	npm install

release: test
	@if gh auth status >/dev/null 2>&1; then \
		rm -Rf CHANGELOG.md; \
		npx standard-version; \
		git push --follow-tags; \
		gh release create $$(git describe --tags --abbrev=0) --notes-file CHANGELOG.md; \
	else \
		echo "GitHub CLI not authenticated. Run 'gh auth login' to create releases automatically."; \
		echo "You can manually create a release at: https://github.com/andrewmolyuk/eslint-plugin-vue-modular/releases/new"; \
	fi

drawio:
	/mnt/c/Program\ Files/draw.io/draw.io.exe -x -o docs/assets --transparent -f png docs/assets/drawio/*.drawio
