function existsSync (path) {
  try {
    uv.fs_stat(path);
  } catch (err) {
    return false;
  }
  return true;
}

function isFile (path) {
  return (uv.fs_stat(path).type === 'file');
}

var BUFFER_SIZE = 8192;

function readFileSync (filename, encoding_) {
  var encoding = encoding_ ? encoding_ : 'utf8';

  var fd = uv.fs_open(filename, 'r', 0666);
  var buf;
  var count = 0;
  var r;

  while ((r = uv.fs_read(fd, BUFFER_SIZE, (BUFFER_SIZE * count))) !== undefined) {
    count++;
    if (r.length === 0) {
      break;
    } else {
      if (buf === undefined) {
        if (encoding === 'utf8') {
          buf = r;
        } else {
          buf = Duktape.Buffer(r);
        }
      } else {
        if (encoding === 'utf8') {
          buf += r;
        } else {
          buf = Duktape.Buffer(buf + r);
        }
      }
    }
  }

  uv.fs_close(fd);

  return buf;
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
  var nparts = parts.slice();

  if (type === '') {
    nparts[nparts.length - 1] = nparts[nparts.length - 1] + '.js';
  }

  // permutations:

  // cwd/parts
  path = '/' + cwd + parts.join('/');
  if (existsSync(path) && isFile(path)) {
    return path;
  }

  // cwd/nparts
  path = '/' + cwd + nparts.join('/');
  if (existsSync(path) && isFile(path)) {
    return path;
  }

  // cwd/duk_modules/parts
  path = '/' + cwd + '/duk_modules/' + parts.join('/');
  if (existsSync(path) && isFile(path)) {
    return path;
  }

  // cwd/duk_modules/nparts
  path = '/' + cwd + '/duk_modules/' + nparts.join('/');
  if (existsSync(path) && isFile(path)) {
    return path;
  }

  // ./duk_modules/parts
  path = './duk_modules/' + parts.join('/');
  if (existsSync(path) && isFile(path)) {
    return path;
  }

  // ./duk_modules/nparts
  path = './duk_modules/' + nparts.join('/');
  if (existsSync(path) && isFile(path)) {
    return path;
  }

  // ./node_modules/parts
  path = './node_modules/' + parts.join('/');
  if (existsSync(path) && isFile(path)) {
    return path;
  }

  // ./node_modules/nparts
  path = './node_modules/' + nparts.join('/');
  if (existsSync(path) && isFile(path)) {
    return path;
  }

  // ./node_modules/parts/{main}
  print('./node_modules/' + parts.join('/') + '/package.json');
  if (existsSync('./node_modules/' + parts.join('/') + '/package.json')) {
    try {
      var data = readFileSync('./node_modules/' + parts.join('/') + '/package.json');
      var json = JSON.parse(data);

      path = './node_modules/' + parts.join('/') + '/' + json.main;
      if (existsSync(path) && isFile(path)) {
        return path;
      }
    } catch (err) { }
  }

  // ./node_modules/parts/{main}.js
  if (existsSync('./node_modules/' + parts.join('/') + '/package.json')) {
    try {
      var data = readFileSync('./node_modules/' + parts.join('/') + '/package.json');
      var json = JSON.parse(data);

      path = './node_modules/' + parts.join('/') + '/' + json.main + '.js';
      if (existsSync(path) && isFile(path)) {
        return path;
      }
    } catch (err) { }
  }

  // /parts
  path = parts.join('/');
  if (existsSync(path)) {
    return path;
  }

  // /nparts
  path = nparts.join('/');
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
