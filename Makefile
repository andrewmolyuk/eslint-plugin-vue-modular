.PHONY: install lint test build update drawio clean
DEFAULT_GOAL := build

install:
	bun install --no-audit --no-fund 
	
lint: install
	npx eslint . --ext .js,.ts,.json,.md --fix
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
	@chmod +x .scripts/drawio.sh || true
	@.scripts/drawio.sh

clean:
	@chmod +x .scripts/clean.sh || true
	@.scripts/clean.sh
