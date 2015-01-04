INSTALL_DIR=/usr/local
MODULE_DIR=$(INSTALL_DIR)/lib/dukluv/

build:
	@gcc src/vm.c -o lib/vm.so -Wl,-undefined -Wl,dynamic_lookup

install:
	@mkdir -p $(INSTALL_DIR)
	@mkdir -p $(MODULE_DIR)
	@cp -R duk_modules lib repl.js bootstrap.js $(MODULE_DIR)
	@cp bin/dl $(INSTALL_DIR)/bin/

default: build install