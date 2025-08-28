@PHONY: lint install test update release commitlint drawio

install:
	npm install

lint:
	npx eslint . --ext .js,.vue --fix
	npx markdownlint README.md docs/**/*.md --fix

commitlint:
	npx commitlint --from HEAD~1 --to HEAD --verbose

test: lint
	CI=CI npx vitest

update:
	npx npm-check-updates -u
	npm install

release: test
	@if [ -n "$$(git status --porcelain)" ]; then \
		echo "Error: There are uncommitted changes. Please commit or stash them before releasing."; \
		git status --short; \
		exit 1; \
	fi
	@echo "Testing semantic-release configuration..."
	@echo "Note: Actual releases happen automatically on push to main branch via GitHub Actions."
	@echo "This will show what would be released:"
	@echo ""
	npx semantic-release --dry-run --no-ci || echo "Note: Authentication errors are expected in local dry-run mode."

drawio:
	/mnt/c/Program\ Files/draw.io/draw.io.exe -x -o docs/assets --transparent -f png docs/assets/drawio/*.drawio

