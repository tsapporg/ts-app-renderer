install:
	if [ -d ../ts-npm ]; then \
		npm install -g ../ts-npm; \
	else \
		npm uninstall -g ts-npm; \
		npm install -g "github:tsapporg/ts-npm#f1f6e4c6cead9ae5f8877f25da5ff85382079c5c"; \
	fi;
	
	ts-npm --action=install --absolute-path-to-dependencies=$(shell pwd)/.npm