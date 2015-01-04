exports.inherits = function (ctor, superCtor) {
  ctor.super_ = superCtor;
  ctor.prototype = Object.create(superCtor.prototype, {
    constructor: {
      value: ctor,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
};

function isUndefined (arg) {
  return (arg === void 0);
}
exports.isUndefined = isUndefined;

function isNumber (arg) {
  return (typeof arg === 'number');
}
exports.isNumber = isNumber;

function isFunction (arg) {
  return (typeof arg === 'function');
}
exports.isFunction = isFunction;

function isRegExp (re) {
  return (isObject(re) && objectToString(re) === '[object RegExp]');
}
exports.isRegExp = isRegExp;

function isString(arg) {
  return (typeof arg === 'string');
}
exports.isString = isString;

function isDate (d) {
  return (isObject(d) && objectToString(d) === '[object Date]');
}
exports.isDate = isDate;

function isObject (arg) {
  return (typeof arg === 'object' && arg !== null);
}
exports.isObject = isObject;

function isBuffer (arg) {
  return (typeof arg === 'buffer');
}
exports.isBuffer = isBuffer;

var isArray = exports.isArray = Array.isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg === null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function objectToString(o) {
  return Object.prototype.toString.call(o);
}
