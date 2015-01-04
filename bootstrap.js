function existsSync (path) {
  try {
    uv.fs_stat(path);
  } catch (err) {
    return false;
  }
  return true;
}

var splitPathRe =
      /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;

var modResolve = Duktape.modResolve;
Duktape.modResolve = function (id) {
  var parts = splitPathRe.exec(id).slice(1);
  var type = parts.pop();

  while (parts[0] === '') {
    parts.shift();
  }

  var cwd = splitPathRe.exec(this.id)[2];
  var path;

  if (type === '') {
    parts[parts.length - 1] = parts[parts.length - 1] + '.js';
  }

  // permutations:

  // cwd/parts
  path = '/' + cwd + parts.join('/');
  if (existsSync(path)) {
    return path;
  }

  // cwd/duk_modules/parts
  path = '/' + cwd + '/duk_modules/' + parts.join('/');
  if (existsSync(path)) {
    return path;
  }

  // ./duk_modules/parts
  path = './duk_modules/' + parts.join('/');
  if (existsSync(path)) {
    return path;
  }

  // /parts
  path = parts.join('/');
  if (existsSync(path)) {
    return path;
  }

  return modResolve.call(this, id);
};

global.process = {
  stdout: uv.new_tty(1, false),
  stdin: uv.new_tty(0, true),
  stderr: uv.new_tty(2, false)
};
