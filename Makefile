.PHONY: install lint test build update drawio clean next
SHELL := /bin/bash
DEFAULT_GOAL := build
PACKAGE_MANAGER ?= bun

ifeq ($(PACKAGE_MANAGER),bun)
INSTALL_CMD := bun install --no-audit --no-fund
RUN_CMD := bunx
UPDATE_CMD := bunx npm-check-updates -u && bun install --no-audit --no-fund
else
INSTALL_CMD := npm install --no-audit --no-fund
RUN_CMD := npm exec --
UPDATE_CMD := npx npm-check-updates -u && npm install --no-audit --no-fund
endif
SKILLS_INSTALL_CMD := npx -y autoskills -y >/dev/null
SKILLS_UPDATE_CMD := npx -y skills update -p -y >/dev/null

install:
	$(INSTALL_CMD)
	@$(SKILLS_INSTALL_CMD)
	
lint: install
	$(RUN_CMD) eslint . --ext .js,.ts,.json,.md --fix
	$(RUN_CMD) prettier --write "**/*.md" "**/*.json" "**/*.ts" --log-level warn
	$(RUN_CMD) tsc --noEmit

test: lint
	CI=CI node ./node_modules/vitest/vitest.mjs run --coverage

build: test
	rm -Rf dist
	$(RUN_CMD) tsc --build

update:
	@$(UPDATE_CMD)
	@if [ -d .agents/skills ] || [ -f skills-lock.json ]; then $(SKILLS_UPDATE_CMD); fi

drawio:
	@chmod +x .scripts/drawio.sh || true
	@.scripts/drawio.sh

clean:
	@chmod +x .scripts/clean.sh || true
	@.scripts/clean.sh
	rm -rf .agents
	rm -f skills-lock.json

next:
	git pull origin main
	git checkout main
	git merge next
	git push -u origin main
	make clean