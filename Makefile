.PHONY: install lint test build update drawio clean next
SHELL := /bin/bash
DEFAULT_GOAL := build

install:
	bun install --no-audit --no-fund 
	
lint: install
	bunx eslint . --ext .js,.ts,.json,.md --fix
	bunx prettier --write "**/*.md" "**/*.json" "**/*.ts" --log-level warn
	bunx tsc --noEmit

test: lint
	CI=CI bunx vitest --coverage

build: test
	rm -Rf dist
	bunx tsc --build

update:
	bunx npm-check-updates -u
	bun install --no-audit --no-fund

drawio:
	@chmod +x .scripts/drawio.sh || true
	@.scripts/drawio.sh

clean:
	@chmod +x .scripts/clean.sh || true
	@.scripts/clean.sh

next:
	git pull origin main
	git checkout main
	git merge next
	git push -u origin main
	git pull 
	make clean