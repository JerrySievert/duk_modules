var BUFFER_SIZE = 8;

function rethrow ( ) {
  return function (err) {
    if (err) {
      throw err;  // Forgot a callback
    }
  };
}

function maybeCallback (cb) {
  return typeof cb === 'function' ? cb : rethrow();
}

function open (path, flags, mode_) {
  var mode = typeof mode_ === 'number' ? mode_ : 438 /* 0666 */;
  var callback = maybeCallback(arguments[arguments.length - 1]);

  uv.fs_open(path, flags, mode, function (err, fd) {
    if (err) {
      callback(err);
    } else {
      callback(undefined, fd);
    }
  });
}

function openSync (path, flags, mode_) {
  var mode = typeof mode_ === 'number' ? mode_ : 438 /* 0666 */;
  var fd;

  try {
    fd = uv.fs_open(path, flags, mode);
  } catch (err) {
    return callback(err);
  }

  callback(undefined, fd);
}

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

function readFile (filename, callback) {
  var fd;
  var buf;
  var count = 0;

  try {
    fd = uv.fs_open(filename, 'r', 0666);
  } catch (err) {
    return callback(err);
  }

  function cb (data) {
    if (data.length === 0) {
      uv.fs_close(fd);
      callback(undefined, buf);
    } else {
      count++;
      buf += data;

      uv.fs_read(fd, BUFFER_SIZE, (BUFFER_SIZE * count), cb);
    }
  }

  uv.fs_read(fd, BUFFER_SIZE, (BUFFER_SIZE * count), cb);
}

function exists (path, callback) {
  try {
    uv.fs_stat(path);
  } catch (err) {
    callback(undefined, false);
  }
  callback(undefined, true);
}

function existsSync (path) {
  try {
    uv.fs_stat(path);
  } catch (err) {
    return false;
  }

  return true;
}

exports.readFileSync = readFileSync;
exports.readFile = readFile;
exports.exists = exists;
exports.existsSync = existsSync;