install:
	if [ -d ../ts-npm ]; then \
		npm install -g ../ts-npm; \
	else \
		npm install -g tsapporg/ts-npm; \
	fi;

	ts-npm install

# TODO Just create a fork - this is a hack for missing @types for pngjs/browser.
# npx shx mkdir -p ./node_modules/pngjs-browser
# npx shx cp ./node_modules/pngjs/browser.js ./node_modules/pngjs-browser/
# npx shx cp ./node_modules/pngjs/package.json ./node_modules/pngjs-browser/
# npx shx sed -i "s/.\/lib\/png.js/.\/browser.js/g" ./node_modules/pngjs-browser/package.json
# npx shx sed -i "s/\"pngjs\"/\"pngjs-browser\"/g" ./node_modules/pngjs-browser/package.json

# npx shx mkdir -p ./node_modules/@types/pngjs-browser
# npx shx cp ./node_modules/@types/pngjs/index.d.ts ./node_modules/@types/pngjs-browser/
# npx shx cp ./node_modules/@types/pngjs/package.json ./node_modules/@types/pngjs-browser/
# npx shx sed -i "s/@types\/pngjs/@types\/pngjs-browser/g" ./node_modules/@types/pngjs-browser/package.json
# npx shx sed -i "s/\"@types\/node\"\: \"\*\"//g" ./node_modules/@types/pngjs-browser/package.json
	
tests:
	node --test --loader ts-node/esm \
		--experimental-specifier-resolution=node --experimental-modules --no-warnings \
		./test/renderer.headless.test.unit.ts