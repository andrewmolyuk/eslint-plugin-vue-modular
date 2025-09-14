.PHONY: install lint test build update drawio clean
DEFAULT_GOAL := build

install:
	bun install --no-audit --no-fund 

lint:
	npx eslint . --fix
	npx markdownlint --fix "**/*.md" -i node_modules
	npx prettier --write "**/*.md" "**/*.json" "**/*.ts" --log-level warn
	npx tsc --noEmit

test: lint
	CI=CI npx vitest --coverage

build: test
	rm -Rf dist
	npx tsc --build

update:
	npx npm-check-updates -u
	bun install --no-audit --no-fund

drawio:
	@if [ -z "$(DRAWIO_CMD)" ]; then \
		if [ -x "/mnt/c/Program Files/draw.io/draw.io.exe" ]; then DRAWIO_CMD="/mnt/c/Program Files/draw.io/draw.io.exe"; \
		elif [ -x "/Applications/draw.io.app/Contents/MacOS/draw.io" ]; then DRAWIO_CMD="/Applications/draw.io.app/Contents/MacOS/draw.io"; \
		elif [ -x "/Applications/diagrams.net.app/Contents/MacOS/diagrams.net" ]; then DRAWIO_CMD="/Applications/diagrams.net.app/Contents/MacOS/diagrams.net"; \
		elif command -v draw.io >/dev/null 2>&1; then DRAWIO_CMD="$$(command -v draw.io)"; \
		elif command -v diagrams.net >/dev/null 2>&1; then DRAWIO_CMD="$$(command -v diagrams.net)"; \
		else DRAWIO_CMD=""; fi; \
	fi; \
	if [ -z "$$DRAWIO_CMD" ]; then \
		echo "draw.io/diagrams.net not found. Install it or set DRAWIO_CMD environment variable."; \
		exit 1; \
	fi; \
	"$$DRAWIO_CMD" -x -o docs/assets --transparent -f png docs/assets/drawio/*.drawio

clean:
	@git fetch --prune
	@git branch -vv | awk '/: gone]/{print $$1}' > .git/branches-to-delete || true
	@if [ -s .git/branches-to-delete ]; then \
		echo "---" ; cat .git/branches-to-delete ; \
		while read b; do \
			if [ "$$b" != "$(shell git rev-parse --abbrev-ref HEAD)" ]; then \
				git branch -D $$b || true; \
			else \
				echo "Skipping current branch: $$b"; \
			fi; \
		done < .git/branches-to-delete; \
	else \
		echo "No local branches to delete"; \
	fi;
	@rm -Rf .git/branches-to-delete || true
	@rm -Rf dist node_modules coverage || true
