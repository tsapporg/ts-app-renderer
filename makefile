# This file is responsible for defining ts-app-renderer developer commands.
install:
#make clean
	if [ -d ../../packages ]; then make copy-src-from-monorepo; make install/packages; fi
	npm install -g mainframenzo/ts-npm
	ts-npm install

# TODO Just create a fork - this is a hack for missing @types for pngjs/browser.
	npx shx mkdir -p ./node_modules/pngjs-browser
	npx shx cp ./node_modules/pngjs/browser.js ./node_modules/pngjs-browser/
	npx shx cp ./node_modules/pngjs/package.json ./node_modules/pngjs-browser/
	npx shx sed -i "s/.\/lib\/png.js/.\/browser.js/g" ./node_modules/pngjs-browser/package.json
	npx shx sed -i "s/\"pngjs\"/\"pngjs-browser\"/g" ./node_modules/pngjs-browser/package.json

	npx shx mkdir -p ./node_modules/@types/pngjs-browser
	npx shx cp ./node_modules/@types/pngjs/index.d.ts ./node_modules/@types/pngjs-browser/
	npx shx cp ./node_modules/@types/pngjs/package.json ./node_modules/@types/pngjs-browser/
	npx shx sed -i "s/@types\/pngjs/@types\/pngjs-browser/g" ./node_modules/@types/pngjs-browser/package.json
	npx shx sed -i "s/\"@types\/node\"\: \"\*\"//g" ./node_modules/@types/pngjs-browser/package.json
	
clean:
	npx shx rm -f ./package-lock.json

copy-src-from-monorepo:
	cp ../../config/tsconfig.base.json ./config/

install/packages:
#cd ../ts-app-logger; make install
	
tests:
	make test/unit
	make test/functional
test/unit:
	npx cross-env app_location=local app_stage=local app_env=unit_test node --trace-warnings --experimental-specifier-resolution=node --experimental-modules --no-warnings --loader ts-node/esm ./test/renderer.headless.test.unit.ts --test
test/functional:
	@echo 'TODO'





