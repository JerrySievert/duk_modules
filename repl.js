"use strict";

var vm = require('vm');

var _require = require;
global.require = function (path) {
  return _require(path);
}

uv.read_start(process.stdin, function (err, chunk) {
  if (err) { throw err; }
  if (!chunk) { return uv.read_stop(process.stdin); }
  try {
    print(vm.runInThisContext(chunk.toString()));
  }
  catch (error) {
    uv.write(process.stderr, "error: " + error.toString() + "\n");
  }
  uv.write(process.stdout, "> ");
});
uv.write(process.stdout, "> ");

uv.run();

uv.write(process.stdout, "\n");
