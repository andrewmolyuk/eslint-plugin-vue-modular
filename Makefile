@PHONY: lint install test update commitlint drawio

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

drawio:
	/mnt/c/Program\ Files/draw.io/draw.io.exe -x -o docs/assets --transparent -f png docs/assets/drawio/*.drawio
