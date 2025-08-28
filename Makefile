@PHONY: lint install test update drawio

install:
	npm install --no-audit --no-fund --prefer-offline

lint:
	npx eslint . --ext .js,.vue --fix
	npx markdownlint README.md docs/**/*.md --fix

test: lint
	CI=CI npx vitest

update:
	npx npm-check-updates -u
	npm install --no-audit --no-fund --prefer-offline

drawio:
	/mnt/c/Program\ Files/draw.io/draw.io.exe -x -o docs/assets --transparent -f png docs/assets/drawio/*.drawio
