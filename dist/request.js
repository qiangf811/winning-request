(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('http'), require('https'), require('url'), require('assert'), require('stream'), require('tty'), require('util'), require('os'), require('zlib'), require('vue')) :
  typeof define === 'function' && define.amd ? define(['exports', 'http', 'https', 'url', 'assert', 'stream', 'tty', 'util', 'os', 'zlib', 'vue'], factory) :
  (global = global || self, factory(global['win-request'] = {}, global.http, global.https, global.url, global.assert, global.stream, global.tty, global.util$1, global.os, global.zlib, global.vue));
}(this, (function (exports, http, https, url, assert, stream, tty, util$1, os, zlib, vue) { 'use strict';

  http = http && http.hasOwnProperty('default') ? http['default'] : http;
  https = https && https.hasOwnProperty('default') ? https['default'] : https;
  url = url && url.hasOwnProperty('default') ? url['default'] : url;
  assert = assert && assert.hasOwnProperty('default') ? assert['default'] : assert;
  stream = stream && stream.hasOwnProperty('default') ? stream['default'] : stream;
  tty = tty && tty.hasOwnProperty('default') ? tty['default'] : tty;
  util$1 = util$1 && util$1.hasOwnProperty('default') ? util$1['default'] : util$1;
  os = os && os.hasOwnProperty('default') ? os['default'] : os;
  zlib = zlib && zlib.hasOwnProperty('default') ? zlib['default'] : zlib;
  vue = vue && vue.hasOwnProperty('default') ? vue['default'] : vue;

  var bind = function bind(fn, thisArg) {
    return function wrap() {
      var args = new Array(arguments.length);
      for (var i = 0; i < args.length; i++) {
        args[i] = arguments[i];
      }
      return fn.apply(thisArg, args);
    };
  };

  /*!
   * Determine if an object is a Buffer
   *
   * @author   Feross Aboukhadijeh <https://feross.org>
   * @license  MIT
   */

  var isBuffer = function isBuffer (obj) {
    return obj != null && obj.constructor != null &&
      typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj)
  };

  /*global toString:true*/

  // utils is a library of generic helper functions non-specific to axios

  var toString = Object.prototype.toString;

  /**
   * Determine if a value is an Array
   *
   * @param {Object} val The value to test
   * @returns {boolean} True if value is an Array, otherwise false
   */
  function isArray(val) {
    return toString.call(val) === '[object Array]';
  }

  /**
   * Determine if a value is an ArrayBuffer
   *
   * @param {Object} val The value to test
   * @returns {boolean} True if value is an ArrayBuffer, otherwise false
   */
  function isArrayBuffer(val) {
    return toString.call(val) === '[object ArrayBuffer]';
  }

  /**
   * Determine if a value is a FormData
   *
   * @param {Object} val The value to test
   * @returns {boolean} True if value is an FormData, otherwise false
   */
  function isFormData(val) {
    return (typeof FormData !== 'undefined') && (val instanceof FormData);
  }

  /**
   * Determine if a value is a view on an ArrayBuffer
   *
   * @param {Object} val The value to test
   * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
   */
  function isArrayBufferView(val) {
    var result;
    if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
      result = ArrayBuffer.isView(val);
    } else {
      result = (val) && (val.buffer) && (val.buffer instanceof ArrayBuffer);
    }
    return result;
  }

  /**
   * Determine if a value is a String
   *
   * @param {Object} val The value to test
   * @returns {boolean} True if value is a String, otherwise false
   */
  function isString(val) {
    return typeof val === 'string';
  }

  /**
   * Determine if a value is a Number
   *
   * @param {Object} val The value to test
   * @returns {boolean} True if value is a Number, otherwise false
   */
  function isNumber(val) {
    return typeof val === 'number';
  }

  /**
   * Determine if a value is undefined
   *
   * @param {Object} val The value to test
   * @returns {boolean} True if the value is undefined, otherwise false
   */
  function isUndefined(val) {
    return typeof val === 'undefined';
  }

  /**
   * Determine if a value is an Object
   *
   * @param {Object} val The value to test
   * @returns {boolean} True if value is an Object, otherwise false
   */
  function isObject(val) {
    return val !== null && typeof val === 'object';
  }

  /**
   * Determine if a value is a Date
   *
   * @param {Object} val The value to test
   * @returns {boolean} True if value is a Date, otherwise false
   */
  function isDate(val) {
    return toString.call(val) === '[object Date]';
  }

  /**
   * Determine if a value is a File
   *
   * @param {Object} val The value to test
   * @returns {boolean} True if value is a File, otherwise false
   */
  function isFile(val) {
    return toString.call(val) === '[object File]';
  }

  /**
   * Determine if a value is a Blob
   *
   * @param {Object} val The value to test
   * @returns {boolean} True if value is a Blob, otherwise false
   */
  function isBlob(val) {
    return toString.call(val) === '[object Blob]';
  }

  /**
   * Determine if a value is a Function
   *
   * @param {Object} val The value to test
   * @returns {boolean} True if value is a Function, otherwise false
   */
  function isFunction(val) {
    return toString.call(val) === '[object Function]';
  }

  /**
   * Determine if a value is a Stream
   *
   * @param {Object} val The value to test
   * @returns {boolean} True if value is a Stream, otherwise false
   */
  function isStream(val) {
    return isObject(val) && isFunction(val.pipe);
  }

  /**
   * Determine if a value is a URLSearchParams object
   *
   * @param {Object} val The value to test
   * @returns {boolean} True if value is a URLSearchParams object, otherwise false
   */
  function isURLSearchParams(val) {
    return typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams;
  }

  /**
   * Trim excess whitespace off the beginning and end of a string
   *
   * @param {String} str The String to trim
   * @returns {String} The String freed of excess whitespace
   */
  function trim(str) {
    return str.replace(/^\s*/, '').replace(/\s*$/, '');
  }

  /**
   * Determine if we're running in a standard browser environment
   *
   * This allows axios to run in a web worker, and react-native.
   * Both environments support XMLHttpRequest, but not fully standard globals.
   *
   * web workers:
   *  typeof window -> undefined
   *  typeof document -> undefined
   *
   * react-native:
   *  navigator.product -> 'ReactNative'
   * nativescript
   *  navigator.product -> 'NativeScript' or 'NS'
   */
  function isStandardBrowserEnv() {
    if (typeof navigator !== 'undefined' && (navigator.product === 'ReactNative' ||
                                             navigator.product === 'NativeScript' ||
                                             navigator.product === 'NS')) {
      return false;
    }
    return (
      typeof window !== 'undefined' &&
      typeof document !== 'undefined'
    );
  }

  /**
   * Iterate over an Array or an Object invoking a function for each item.
   *
   * If `obj` is an Array callback will be called passing
   * the value, index, and complete array for each item.
   *
   * If 'obj' is an Object callback will be called passing
   * the value, key, and complete object for each property.
   *
   * @param {Object|Array} obj The object to iterate
   * @param {Function} fn The callback to invoke for each item
   */
  function forEach(obj, fn) {
    // Don't bother if no value provided
    if (obj === null || typeof obj === 'undefined') {
      return;
    }

    // Force an array if not already something iterable
    if (typeof obj !== 'object') {
      /*eslint no-param-reassign:0*/
      obj = [obj];
    }

    if (isArray(obj)) {
      // Iterate over array values
      for (var i = 0, l = obj.length; i < l; i++) {
        fn.call(null, obj[i], i, obj);
      }
    } else {
      // Iterate over object keys
      for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          fn.call(null, obj[key], key, obj);
        }
      }
    }
  }

  /**
   * Accepts varargs expecting each argument to be an object, then
   * immutably merges the properties of each object and returns result.
   *
   * When multiple objects contain the same key the later object in
   * the arguments list will take precedence.
   *
   * Example:
   *
   * ```js
   * var result = merge({foo: 123}, {foo: 456});
   * console.log(result.foo); // outputs 456
   * ```
   *
   * @param {Object} obj1 Object to merge
   * @returns {Object} Result of all merge properties
   */
  function merge(/* obj1, obj2, obj3, ... */) {
    var result = {};
    function assignValue(val, key) {
      if (typeof result[key] === 'object' && typeof val === 'object') {
        result[key] = merge(result[key], val);
      } else {
        result[key] = val;
      }
    }

    for (var i = 0, l = arguments.length; i < l; i++) {
      forEach(arguments[i], assignValue);
    }
    return result;
  }

  /**
   * Function equal to merge with the difference being that no reference
   * to original objects is kept.
   *
   * @see merge
   * @param {Object} obj1 Object to merge
   * @returns {Object} Result of all merge properties
   */
  function deepMerge(/* obj1, obj2, obj3, ... */) {
    var result = {};
    function assignValue(val, key) {
      if (typeof result[key] === 'object' && typeof val === 'object') {
        result[key] = deepMerge(result[key], val);
      } else if (typeof val === 'object') {
        result[key] = deepMerge({}, val);
      } else {
        result[key] = val;
      }
    }

    for (var i = 0, l = arguments.length; i < l; i++) {
      forEach(arguments[i], assignValue);
    }
    return result;
  }

  /**
   * Extends object a by mutably adding to it the properties of object b.
   *
   * @param {Object} a The object to be extended
   * @param {Object} b The object to copy properties from
   * @param {Object} thisArg The object to bind function to
   * @return {Object} The resulting value of object a
   */
  function extend(a, b, thisArg) {
    forEach(b, function assignValue(val, key) {
      if (thisArg && typeof val === 'function') {
        a[key] = bind(val, thisArg);
      } else {
        a[key] = val;
      }
    });
    return a;
  }

  var utils = {
    isArray: isArray,
    isArrayBuffer: isArrayBuffer,
    isBuffer: isBuffer,
    isFormData: isFormData,
    isArrayBufferView: isArrayBufferView,
    isString: isString,
    isNumber: isNumber,
    isObject: isObject,
    isUndefined: isUndefined,
    isDate: isDate,
    isFile: isFile,
    isBlob: isBlob,
    isFunction: isFunction,
    isStream: isStream,
    isURLSearchParams: isURLSearchParams,
    isStandardBrowserEnv: isStandardBrowserEnv,
    forEach: forEach,
    merge: merge,
    deepMerge: deepMerge,
    extend: extend,
    trim: trim
  };

  function encode(val) {
    return encodeURIComponent(val).
      replace(/%40/gi, '@').
      replace(/%3A/gi, ':').
      replace(/%24/g, '$').
      replace(/%2C/gi, ',').
      replace(/%20/g, '+').
      replace(/%5B/gi, '[').
      replace(/%5D/gi, ']');
  }

  /**
   * Build a URL by appending params to the end
   *
   * @param {string} url The base of the url (e.g., http://www.google.com)
   * @param {object} [params] The params to be appended
   * @returns {string} The formatted url
   */
  var buildURL = function buildURL(url, params, paramsSerializer) {
    /*eslint no-param-reassign:0*/
    if (!params) {
      return url;
    }

    var serializedParams;
    if (paramsSerializer) {
      serializedParams = paramsSerializer(params);
    } else if (utils.isURLSearchParams(params)) {
      serializedParams = params.toString();
    } else {
      var parts = [];

      utils.forEach(params, function serialize(val, key) {
        if (val === null || typeof val === 'undefined') {
          return;
        }

        if (utils.isArray(val)) {
          key = key + '[]';
        } else {
          val = [val];
        }

        utils.forEach(val, function parseValue(v) {
          if (utils.isDate(v)) {
            v = v.toISOString();
          } else if (utils.isObject(v)) {
            v = JSON.stringify(v);
          }
          parts.push(encode(key) + '=' + encode(v));
        });
      });

      serializedParams = parts.join('&');
    }

    if (serializedParams) {
      var hashmarkIndex = url.indexOf('#');
      if (hashmarkIndex !== -1) {
        url = url.slice(0, hashmarkIndex);
      }

      url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
    }

    return url;
  };

  function InterceptorManager() {
    this.handlers = [];
  }

  /**
   * Add a new interceptor to the stack
   *
   * @param {Function} fulfilled The function to handle `then` for a `Promise`
   * @param {Function} rejected The function to handle `reject` for a `Promise`
   *
   * @return {Number} An ID used to remove interceptor later
   */
  InterceptorManager.prototype.use = function use(fulfilled, rejected) {
    this.handlers.push({
      fulfilled: fulfilled,
      rejected: rejected
    });
    return this.handlers.length - 1;
  };

  /**
   * Remove an interceptor from the stack
   *
   * @param {Number} id The ID that was returned by `use`
   */
  InterceptorManager.prototype.eject = function eject(id) {
    if (this.handlers[id]) {
      this.handlers[id] = null;
    }
  };

  /**
   * Iterate over all the registered interceptors
   *
   * This method is particularly useful for skipping over any
   * interceptors that may have become `null` calling `eject`.
   *
   * @param {Function} fn The function to call for each interceptor
   */
  InterceptorManager.prototype.forEach = function forEach(fn) {
    utils.forEach(this.handlers, function forEachHandler(h) {
      if (h !== null) {
        fn(h);
      }
    });
  };

  var InterceptorManager_1 = InterceptorManager;

  /**
   * Transform the data for a request or a response
   *
   * @param {Object|String} data The data to be transformed
   * @param {Array} headers The headers for the request or response
   * @param {Array|Function} fns A single function or Array of functions
   * @returns {*} The resulting transformed data
   */
  var transformData = function transformData(data, headers, fns) {
    /*eslint no-param-reassign:0*/
    utils.forEach(fns, function transform(fn) {
      data = fn(data, headers);
    });

    return data;
  };

  var isCancel = function isCancel(value) {
    return !!(value && value.__CANCEL__);
  };

  var normalizeHeaderName = function normalizeHeaderName(headers, normalizedName) {
    utils.forEach(headers, function processHeader(value, name) {
      if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
        headers[normalizedName] = value;
        delete headers[name];
      }
    });
  };

  /**
   * Update an Error with the specified config, error code, and response.
   *
   * @param {Error} error The error to update.
   * @param {Object} config The config.
   * @param {string} [code] The error code (for example, 'ECONNABORTED').
   * @param {Object} [request] The request.
   * @param {Object} [response] The response.
   * @returns {Error} The error.
   */
  var enhanceError = function enhanceError(error, config, code, request, response) {
    error.config = config;
    if (code) {
      error.code = code;
    }

    error.request = request;
    error.response = response;
    error.isAxiosError = true;

    error.toJSON = function() {
      return {
        // Standard
        message: this.message,
        name: this.name,
        // Microsoft
        description: this.description,
        number: this.number,
        // Mozilla
        fileName: this.fileName,
        lineNumber: this.lineNumber,
        columnNumber: this.columnNumber,
        stack: this.stack,
        // Axios
        config: this.config,
        code: this.code
      };
    };
    return error;
  };

  /**
   * Create an Error with the specified message, config, error code, request and response.
   *
   * @param {string} message The error message.
   * @param {Object} config The config.
   * @param {string} [code] The error code (for example, 'ECONNABORTED').
   * @param {Object} [request] The request.
   * @param {Object} [response] The response.
   * @returns {Error} The created error.
   */
  var createError = function createError(message, config, code, request, response) {
    var error = new Error(message);
    return enhanceError(error, config, code, request, response);
  };

  /**
   * Resolve or reject a Promise based on response status.
   *
   * @param {Function} resolve A function that resolves the promise.
   * @param {Function} reject A function that rejects the promise.
   * @param {object} response The response.
   */
  var settle = function settle(resolve, reject, response) {
    var validateStatus = response.config.validateStatus;
    if (!validateStatus || validateStatus(response.status)) {
      resolve(response);
    } else {
      reject(createError(
        'Request failed with status code ' + response.status,
        response.config,
        null,
        response.request,
        response
      ));
    }
  };

  function unwrapExports (x) {
  	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
  }

  function createCommonjsModule(fn, module) {
  	return module = { exports: {} }, fn(module, module.exports), module.exports;
  }

  function getCjsExportFromNamespace (n) {
  	return n && n['default'] || n;
  }

  /**
   * Helpers.
   */

  var s = 1000;
  var m = s * 60;
  var h = m * 60;
  var d = h * 24;
  var y = d * 365.25;

  /**
   * Parse or format the given `val`.
   *
   * Options:
   *
   *  - `long` verbose formatting [false]
   *
   * @param {String|Number} val
   * @param {Object} [options]
   * @throws {Error} throw an error if val is not a non-empty string or a number
   * @return {String|Number}
   * @api public
   */

  var ms = function(val, options) {
    options = options || {};
    var type = typeof val;
    if (type === 'string' && val.length > 0) {
      return parse(val);
    } else if (type === 'number' && isNaN(val) === false) {
      return options.long ? fmtLong(val) : fmtShort(val);
    }
    throw new Error(
      'val is not a non-empty string or a valid number. val=' +
        JSON.stringify(val)
    );
  };

  /**
   * Parse the given `str` and return milliseconds.
   *
   * @param {String} str
   * @return {Number}
   * @api private
   */

  function parse(str) {
    str = String(str);
    if (str.length > 100) {
      return;
    }
    var match = /^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(
      str
    );
    if (!match) {
      return;
    }
    var n = parseFloat(match[1]);
    var type = (match[2] || 'ms').toLowerCase();
    switch (type) {
      case 'years':
      case 'year':
      case 'yrs':
      case 'yr':
      case 'y':
        return n * y;
      case 'days':
      case 'day':
      case 'd':
        return n * d;
      case 'hours':
      case 'hour':
      case 'hrs':
      case 'hr':
      case 'h':
        return n * h;
      case 'minutes':
      case 'minute':
      case 'mins':
      case 'min':
      case 'm':
        return n * m;
      case 'seconds':
      case 'second':
      case 'secs':
      case 'sec':
      case 's':
        return n * s;
      case 'milliseconds':
      case 'millisecond':
      case 'msecs':
      case 'msec':
      case 'ms':
        return n;
      default:
        return undefined;
    }
  }

  /**
   * Short format for `ms`.
   *
   * @param {Number} ms
   * @return {String}
   * @api private
   */

  function fmtShort(ms) {
    if (ms >= d) {
      return Math.round(ms / d) + 'd';
    }
    if (ms >= h) {
      return Math.round(ms / h) + 'h';
    }
    if (ms >= m) {
      return Math.round(ms / m) + 'm';
    }
    if (ms >= s) {
      return Math.round(ms / s) + 's';
    }
    return ms + 'ms';
  }

  /**
   * Long format for `ms`.
   *
   * @param {Number} ms
   * @return {String}
   * @api private
   */

  function fmtLong(ms) {
    return plural(ms, d, 'day') ||
      plural(ms, h, 'hour') ||
      plural(ms, m, 'minute') ||
      plural(ms, s, 'second') ||
      ms + ' ms';
  }

  /**
   * Pluralization helper.
   */

  function plural(ms, n, name) {
    if (ms < n) {
      return;
    }
    if (ms < n * 1.5) {
      return Math.floor(ms / n) + ' ' + name;
    }
    return Math.ceil(ms / n) + ' ' + name + 's';
  }

  var debug = createCommonjsModule(function (module, exports) {
  /**
   * This is the common logic for both the Node.js and web browser
   * implementations of `debug()`.
   *
   * Expose `debug()` as the module.
   */

  exports = module.exports = createDebug.debug = createDebug['default'] = createDebug;
  exports.coerce = coerce;
  exports.disable = disable;
  exports.enable = enable;
  exports.enabled = enabled;
  exports.humanize = ms;

  /**
   * Active `debug` instances.
   */
  exports.instances = [];

  /**
   * The currently active debug mode names, and names to skip.
   */

  exports.names = [];
  exports.skips = [];

  /**
   * Map of special "%n" handling functions, for the debug "format" argument.
   *
   * Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
   */

  exports.formatters = {};

  /**
   * Select a color.
   * @param {String} namespace
   * @return {Number}
   * @api private
   */

  function selectColor(namespace) {
    var hash = 0, i;

    for (i in namespace) {
      hash  = ((hash << 5) - hash) + namespace.charCodeAt(i);
      hash |= 0; // Convert to 32bit integer
    }

    return exports.colors[Math.abs(hash) % exports.colors.length];
  }

  /**
   * Create a debugger with the given `namespace`.
   *
   * @param {String} namespace
   * @return {Function}
   * @api public
   */

  function createDebug(namespace) {

    var prevTime;

    function debug() {
      // disabled?
      if (!debug.enabled) return;

      var self = debug;

      // set `diff` timestamp
      var curr = +new Date();
      var ms = curr - (prevTime || curr);
      self.diff = ms;
      self.prev = prevTime;
      self.curr = curr;
      prevTime = curr;

      // turn the `arguments` into a proper Array
      var args = new Array(arguments.length);
      for (var i = 0; i < args.length; i++) {
        args[i] = arguments[i];
      }

      args[0] = exports.coerce(args[0]);

      if ('string' !== typeof args[0]) {
        // anything else let's inspect with %O
        args.unshift('%O');
      }

      // apply any `formatters` transformations
      var index = 0;
      args[0] = args[0].replace(/%([a-zA-Z%])/g, function(match, format) {
        // if we encounter an escaped % then don't increase the array index
        if (match === '%%') return match;
        index++;
        var formatter = exports.formatters[format];
        if ('function' === typeof formatter) {
          var val = args[index];
          match = formatter.call(self, val);

          // now we need to remove `args[index]` since it's inlined in the `format`
          args.splice(index, 1);
          index--;
        }
        return match;
      });

      // apply env-specific formatting (colors, etc.)
      exports.formatArgs.call(self, args);

      var logFn = debug.log || exports.log || console.log.bind(console);
      logFn.apply(self, args);
    }

    debug.namespace = namespace;
    debug.enabled = exports.enabled(namespace);
    debug.useColors = exports.useColors();
    debug.color = selectColor(namespace);
    debug.destroy = destroy;

    // env-specific initialization logic for debug instances
    if ('function' === typeof exports.init) {
      exports.init(debug);
    }

    exports.instances.push(debug);

    return debug;
  }

  function destroy () {
    var index = exports.instances.indexOf(this);
    if (index !== -1) {
      exports.instances.splice(index, 1);
      return true;
    } else {
      return false;
    }
  }

  /**
   * Enables a debug mode by namespaces. This can include modes
   * separated by a colon and wildcards.
   *
   * @param {String} namespaces
   * @api public
   */

  function enable(namespaces) {
    exports.save(namespaces);

    exports.names = [];
    exports.skips = [];

    var i;
    var split = (typeof namespaces === 'string' ? namespaces : '').split(/[\s,]+/);
    var len = split.length;

    for (i = 0; i < len; i++) {
      if (!split[i]) continue; // ignore empty strings
      namespaces = split[i].replace(/\*/g, '.*?');
      if (namespaces[0] === '-') {
        exports.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
      } else {
        exports.names.push(new RegExp('^' + namespaces + '$'));
      }
    }

    for (i = 0; i < exports.instances.length; i++) {
      var instance = exports.instances[i];
      instance.enabled = exports.enabled(instance.namespace);
    }
  }

  /**
   * Disable debug output.
   *
   * @api public
   */

  function disable() {
    exports.enable('');
  }

  /**
   * Returns true if the given mode name is enabled, false otherwise.
   *
   * @param {String} name
   * @return {Boolean}
   * @api public
   */

  function enabled(name) {
    if (name[name.length - 1] === '*') {
      return true;
    }
    var i, len;
    for (i = 0, len = exports.skips.length; i < len; i++) {
      if (exports.skips[i].test(name)) {
        return false;
      }
    }
    for (i = 0, len = exports.names.length; i < len; i++) {
      if (exports.names[i].test(name)) {
        return true;
      }
    }
    return false;
  }

  /**
   * Coerce `val`.
   *
   * @param {Mixed} val
   * @return {Mixed}
   * @api private
   */

  function coerce(val) {
    if (val instanceof Error) return val.stack || val.message;
    return val;
  }
  });
  var debug_1 = debug.coerce;
  var debug_2 = debug.disable;
  var debug_3 = debug.enable;
  var debug_4 = debug.enabled;
  var debug_5 = debug.humanize;
  var debug_6 = debug.instances;
  var debug_7 = debug.names;
  var debug_8 = debug.skips;
  var debug_9 = debug.formatters;

  var browser = createCommonjsModule(function (module, exports) {
  /**
   * This is the web browser implementation of `debug()`.
   *
   * Expose `debug()` as the module.
   */

  exports = module.exports = debug;
  exports.log = log;
  exports.formatArgs = formatArgs;
  exports.save = save;
  exports.load = load;
  exports.useColors = useColors;
  exports.storage = 'undefined' != typeof chrome
                 && 'undefined' != typeof chrome.storage
                    ? chrome.storage.local
                    : localstorage();

  /**
   * Colors.
   */

  exports.colors = [
    '#0000CC', '#0000FF', '#0033CC', '#0033FF', '#0066CC', '#0066FF', '#0099CC',
    '#0099FF', '#00CC00', '#00CC33', '#00CC66', '#00CC99', '#00CCCC', '#00CCFF',
    '#3300CC', '#3300FF', '#3333CC', '#3333FF', '#3366CC', '#3366FF', '#3399CC',
    '#3399FF', '#33CC00', '#33CC33', '#33CC66', '#33CC99', '#33CCCC', '#33CCFF',
    '#6600CC', '#6600FF', '#6633CC', '#6633FF', '#66CC00', '#66CC33', '#9900CC',
    '#9900FF', '#9933CC', '#9933FF', '#99CC00', '#99CC33', '#CC0000', '#CC0033',
    '#CC0066', '#CC0099', '#CC00CC', '#CC00FF', '#CC3300', '#CC3333', '#CC3366',
    '#CC3399', '#CC33CC', '#CC33FF', '#CC6600', '#CC6633', '#CC9900', '#CC9933',
    '#CCCC00', '#CCCC33', '#FF0000', '#FF0033', '#FF0066', '#FF0099', '#FF00CC',
    '#FF00FF', '#FF3300', '#FF3333', '#FF3366', '#FF3399', '#FF33CC', '#FF33FF',
    '#FF6600', '#FF6633', '#FF9900', '#FF9933', '#FFCC00', '#FFCC33'
  ];

  /**
   * Currently only WebKit-based Web Inspectors, Firefox >= v31,
   * and the Firebug extension (any Firefox version) are known
   * to support "%c" CSS customizations.
   *
   * TODO: add a `localStorage` variable to explicitly enable/disable colors
   */

  function useColors() {
    // NB: In an Electron preload script, document will be defined but not fully
    // initialized. Since we know we're in Chrome, we'll just detect this case
    // explicitly
    if (typeof window !== 'undefined' && window.process && window.process.type === 'renderer') {
      return true;
    }

    // Internet Explorer and Edge do not support colors.
    if (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
      return false;
    }

    // is webkit? http://stackoverflow.com/a/16459606/376773
    // document is undefined in react-native: https://github.com/facebook/react-native/pull/1632
    return (typeof document !== 'undefined' && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance) ||
      // is firebug? http://stackoverflow.com/a/398120/376773
      (typeof window !== 'undefined' && window.console && (window.console.firebug || (window.console.exception && window.console.table))) ||
      // is firefox >= v31?
      // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
      (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31) ||
      // double check webkit in userAgent just in case we are in a worker
      (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/));
  }

  /**
   * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
   */

  exports.formatters.j = function(v) {
    try {
      return JSON.stringify(v);
    } catch (err) {
      return '[UnexpectedJSONParseError]: ' + err.message;
    }
  };


  /**
   * Colorize log arguments if enabled.
   *
   * @api public
   */

  function formatArgs(args) {
    var useColors = this.useColors;

    args[0] = (useColors ? '%c' : '')
      + this.namespace
      + (useColors ? ' %c' : ' ')
      + args[0]
      + (useColors ? '%c ' : ' ')
      + '+' + exports.humanize(this.diff);

    if (!useColors) return;

    var c = 'color: ' + this.color;
    args.splice(1, 0, c, 'color: inherit');

    // the final "%c" is somewhat tricky, because there could be other
    // arguments passed either before or after the %c, so we need to
    // figure out the correct index to insert the CSS into
    var index = 0;
    var lastC = 0;
    args[0].replace(/%[a-zA-Z%]/g, function(match) {
      if ('%%' === match) return;
      index++;
      if ('%c' === match) {
        // we only are interested in the *last* %c
        // (the user may have provided their own)
        lastC = index;
      }
    });

    args.splice(lastC, 0, c);
  }

  /**
   * Invokes `console.log()` when available.
   * No-op when `console.log` is not a "function".
   *
   * @api public
   */

  function log() {
    // this hackery is required for IE8/9, where
    // the `console.log` function doesn't have 'apply'
    return 'object' === typeof console
      && console.log
      && Function.prototype.apply.call(console.log, console, arguments);
  }

  /**
   * Save `namespaces`.
   *
   * @param {String} namespaces
   * @api private
   */

  function save(namespaces) {
    try {
      if (null == namespaces) {
        exports.storage.removeItem('debug');
      } else {
        exports.storage.debug = namespaces;
      }
    } catch(e) {}
  }

  /**
   * Load `namespaces`.
   *
   * @return {String} returns the previously persisted debug modes
   * @api private
   */

  function load() {
    var r;
    try {
      r = exports.storage.debug;
    } catch(e) {}

    // If debug isn't set in LS, and we're in Electron, try to load $DEBUG
    if (!r && typeof process !== 'undefined' && 'env' in process) {
      r = process.env.DEBUG;
    }

    return r;
  }

  /**
   * Enable namespaces listed in `localStorage.debug` initially.
   */

  exports.enable(load());

  /**
   * Localstorage attempts to return the localstorage.
   *
   * This is necessary because safari throws
   * when a user disables cookies/localstorage
   * and you attempt to access it.
   *
   * @return {LocalStorage}
   * @api private
   */

  function localstorage() {
    try {
      return window.localStorage;
    } catch (e) {}
  }
  });
  var browser_1 = browser.log;
  var browser_2 = browser.formatArgs;
  var browser_3 = browser.save;
  var browser_4 = browser.load;
  var browser_5 = browser.useColors;
  var browser_6 = browser.storage;
  var browser_7 = browser.colors;

  var hasFlag = (flag, argv) => {
  	argv = argv || process.argv;
  	const prefix = flag.startsWith('-') ? '' : (flag.length === 1 ? '-' : '--');
  	const pos = argv.indexOf(prefix + flag);
  	const terminatorPos = argv.indexOf('--');
  	return pos !== -1 && (terminatorPos === -1 ? true : pos < terminatorPos);
  };

  const env = process.env;

  let forceColor;
  if (hasFlag('no-color') ||
  	hasFlag('no-colors') ||
  	hasFlag('color=false')) {
  	forceColor = false;
  } else if (hasFlag('color') ||
  	hasFlag('colors') ||
  	hasFlag('color=true') ||
  	hasFlag('color=always')) {
  	forceColor = true;
  }
  if ('FORCE_COLOR' in env) {
  	forceColor = env.FORCE_COLOR.length === 0 || parseInt(env.FORCE_COLOR, 10) !== 0;
  }

  function translateLevel(level) {
  	if (level === 0) {
  		return false;
  	}

  	return {
  		level,
  		hasBasic: true,
  		has256: level >= 2,
  		has16m: level >= 3
  	};
  }

  function supportsColor(stream) {
  	if (forceColor === false) {
  		return 0;
  	}

  	if (hasFlag('color=16m') ||
  		hasFlag('color=full') ||
  		hasFlag('color=truecolor')) {
  		return 3;
  	}

  	if (hasFlag('color=256')) {
  		return 2;
  	}

  	if (stream && !stream.isTTY && forceColor !== true) {
  		return 0;
  	}

  	const min = forceColor ? 1 : 0;

  	if (process.platform === 'win32') {
  		// Node.js 7.5.0 is the first version of Node.js to include a patch to
  		// libuv that enables 256 color output on Windows. Anything earlier and it
  		// won't work. However, here we target Node.js 8 at minimum as it is an LTS
  		// release, and Node.js 7 is not. Windows 10 build 10586 is the first Windows
  		// release that supports 256 colors. Windows 10 build 14931 is the first release
  		// that supports 16m/TrueColor.
  		const osRelease = os.release().split('.');
  		if (
  			Number(process.versions.node.split('.')[0]) >= 8 &&
  			Number(osRelease[0]) >= 10 &&
  			Number(osRelease[2]) >= 10586
  		) {
  			return Number(osRelease[2]) >= 14931 ? 3 : 2;
  		}

  		return 1;
  	}

  	if ('CI' in env) {
  		if (['TRAVIS', 'CIRCLECI', 'APPVEYOR', 'GITLAB_CI'].some(sign => sign in env) || env.CI_NAME === 'codeship') {
  			return 1;
  		}

  		return min;
  	}

  	if ('TEAMCITY_VERSION' in env) {
  		return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(env.TEAMCITY_VERSION) ? 1 : 0;
  	}

  	if (env.COLORTERM === 'truecolor') {
  		return 3;
  	}

  	if ('TERM_PROGRAM' in env) {
  		const version = parseInt((env.TERM_PROGRAM_VERSION || '').split('.')[0], 10);

  		switch (env.TERM_PROGRAM) {
  			case 'iTerm.app':
  				return version >= 3 ? 3 : 2;
  			case 'Apple_Terminal':
  				return 2;
  			// No default
  		}
  	}

  	if (/-256(color)?$/i.test(env.TERM)) {
  		return 2;
  	}

  	if (/^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(env.TERM)) {
  		return 1;
  	}

  	if ('COLORTERM' in env) {
  		return 1;
  	}

  	if (env.TERM === 'dumb') {
  		return min;
  	}

  	return min;
  }

  function getSupportLevel(stream) {
  	const level = supportsColor(stream);
  	return translateLevel(level);
  }

  var supportsColor_1 = {
  	supportsColor: getSupportLevel,
  	stdout: getSupportLevel(process.stdout),
  	stderr: getSupportLevel(process.stderr)
  };

  var node = createCommonjsModule(function (module, exports) {
  /**
   * Module dependencies.
   */




  /**
   * This is the Node.js implementation of `debug()`.
   *
   * Expose `debug()` as the module.
   */

  exports = module.exports = debug;
  exports.init = init;
  exports.log = log;
  exports.formatArgs = formatArgs;
  exports.save = save;
  exports.load = load;
  exports.useColors = useColors;

  /**
   * Colors.
   */

  exports.colors = [ 6, 2, 3, 4, 5, 1 ];

  try {
    var supportsColor = supportsColor_1;
    if (supportsColor && supportsColor.level >= 2) {
      exports.colors = [
        20, 21, 26, 27, 32, 33, 38, 39, 40, 41, 42, 43, 44, 45, 56, 57, 62, 63, 68,
        69, 74, 75, 76, 77, 78, 79, 80, 81, 92, 93, 98, 99, 112, 113, 128, 129, 134,
        135, 148, 149, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171,
        172, 173, 178, 179, 184, 185, 196, 197, 198, 199, 200, 201, 202, 203, 204,
        205, 206, 207, 208, 209, 214, 215, 220, 221
      ];
    }
  } catch (err) {
    // swallow - we only care if `supports-color` is available; it doesn't have to be.
  }

  /**
   * Build up the default `inspectOpts` object from the environment variables.
   *
   *   $ DEBUG_COLORS=no DEBUG_DEPTH=10 DEBUG_SHOW_HIDDEN=enabled node script.js
   */

  exports.inspectOpts = Object.keys(process.env).filter(function (key) {
    return /^debug_/i.test(key);
  }).reduce(function (obj, key) {
    // camel-case
    var prop = key
      .substring(6)
      .toLowerCase()
      .replace(/_([a-z])/g, function (_, k) { return k.toUpperCase() });

    // coerce string value into JS value
    var val = process.env[key];
    if (/^(yes|on|true|enabled)$/i.test(val)) val = true;
    else if (/^(no|off|false|disabled)$/i.test(val)) val = false;
    else if (val === 'null') val = null;
    else val = Number(val);

    obj[prop] = val;
    return obj;
  }, {});

  /**
   * Is stdout a TTY? Colored output is enabled when `true`.
   */

  function useColors() {
    return 'colors' in exports.inspectOpts
      ? Boolean(exports.inspectOpts.colors)
      : tty.isatty(process.stderr.fd);
  }

  /**
   * Map %o to `util.inspect()`, all on a single line.
   */

  exports.formatters.o = function(v) {
    this.inspectOpts.colors = this.useColors;
    return util$1.inspect(v, this.inspectOpts)
      .split('\n').map(function(str) {
        return str.trim()
      }).join(' ');
  };

  /**
   * Map %o to `util.inspect()`, allowing multiple lines if needed.
   */

  exports.formatters.O = function(v) {
    this.inspectOpts.colors = this.useColors;
    return util$1.inspect(v, this.inspectOpts);
  };

  /**
   * Adds ANSI color escape codes if enabled.
   *
   * @api public
   */

  function formatArgs(args) {
    var name = this.namespace;
    var useColors = this.useColors;

    if (useColors) {
      var c = this.color;
      var colorCode = '\u001b[3' + (c < 8 ? c : '8;5;' + c);
      var prefix = '  ' + colorCode + ';1m' + name + ' ' + '\u001b[0m';

      args[0] = prefix + args[0].split('\n').join('\n' + prefix);
      args.push(colorCode + 'm+' + exports.humanize(this.diff) + '\u001b[0m');
    } else {
      args[0] = getDate() + name + ' ' + args[0];
    }
  }

  function getDate() {
    if (exports.inspectOpts.hideDate) {
      return '';
    } else {
      return new Date().toISOString() + ' ';
    }
  }

  /**
   * Invokes `util.format()` with the specified arguments and writes to stderr.
   */

  function log() {
    return process.stderr.write(util$1.format.apply(util$1, arguments) + '\n');
  }

  /**
   * Save `namespaces`.
   *
   * @param {String} namespaces
   * @api private
   */

  function save(namespaces) {
    if (null == namespaces) {
      // If you set a process.env field to null or undefined, it gets cast to the
      // string 'null' or 'undefined'. Just delete instead.
      delete process.env.DEBUG;
    } else {
      process.env.DEBUG = namespaces;
    }
  }

  /**
   * Load `namespaces`.
   *
   * @return {String} returns the previously persisted debug modes
   * @api private
   */

  function load() {
    return process.env.DEBUG;
  }

  /**
   * Init logic for `debug` instances.
   *
   * Create a new `inspectOpts` object in case `useColors` is set
   * differently for a particular `debug` instance.
   */

  function init (debug) {
    debug.inspectOpts = {};

    var keys = Object.keys(exports.inspectOpts);
    for (var i = 0; i < keys.length; i++) {
      debug.inspectOpts[keys[i]] = exports.inspectOpts[keys[i]];
    }
  }

  /**
   * Enable namespaces listed in `process.env.DEBUG` initially.
   */

  exports.enable(load());
  });
  var node_1 = node.init;
  var node_2 = node.log;
  var node_3 = node.formatArgs;
  var node_4 = node.save;
  var node_5 = node.load;
  var node_6 = node.useColors;
  var node_7 = node.colors;
  var node_8 = node.inspectOpts;

  var src = createCommonjsModule(function (module) {
  /**
   * Detect Electron renderer process, which is node, but we should
   * treat as a browser.
   */

  if (typeof process === 'undefined' || process.type === 'renderer') {
    module.exports = browser;
  } else {
    module.exports = node;
  }
  });

  var Writable = stream.Writable;
  var debug$1 = src("follow-redirects");

  // RFC7231§4.2.1: Of the request methods defined by this specification,
  // the GET, HEAD, OPTIONS, and TRACE methods are defined to be safe.
  var SAFE_METHODS = { GET: true, HEAD: true, OPTIONS: true, TRACE: true };

  // Create handlers that pass events from native requests
  var eventHandlers = Object.create(null);
  ["abort", "aborted", "error", "socket", "timeout"].forEach(function (event) {
    eventHandlers[event] = function (arg) {
      this._redirectable.emit(event, arg);
    };
  });

  // An HTTP(S) request that can be redirected
  function RedirectableRequest(options, responseCallback) {
    // Initialize the request
    Writable.call(this);
    options.headers = options.headers || {};
    this._options = options;
    this._redirectCount = 0;
    this._redirects = [];
    this._requestBodyLength = 0;
    this._requestBodyBuffers = [];

    // Since http.request treats host as an alias of hostname,
    // but the url module interprets host as hostname plus port,
    // eliminate the host property to avoid confusion.
    if (options.host) {
      // Use hostname if set, because it has precedence
      if (!options.hostname) {
        options.hostname = options.host;
      }
      delete options.host;
    }

    // Attach a callback if passed
    if (responseCallback) {
      this.on("response", responseCallback);
    }

    // React to responses of native requests
    var self = this;
    this._onNativeResponse = function (response) {
      self._processResponse(response);
    };

    // Complete the URL object when necessary
    if (!options.pathname && options.path) {
      var searchPos = options.path.indexOf("?");
      if (searchPos < 0) {
        options.pathname = options.path;
      }
      else {
        options.pathname = options.path.substring(0, searchPos);
        options.search = options.path.substring(searchPos);
      }
    }

    // Perform the first request
    this._performRequest();
  }
  RedirectableRequest.prototype = Object.create(Writable.prototype);

  // Writes buffered data to the current native request
  RedirectableRequest.prototype.write = function (data, encoding, callback) {
    // Validate input and shift parameters if necessary
    if (!(typeof data === "string" || typeof data === "object" && ("length" in data))) {
      throw new Error("data should be a string, Buffer or Uint8Array");
    }
    if (typeof encoding === "function") {
      callback = encoding;
      encoding = null;
    }

    // Ignore empty buffers, since writing them doesn't invoke the callback
    // https://github.com/nodejs/node/issues/22066
    if (data.length === 0) {
      if (callback) {
        callback();
      }
      return;
    }
    // Only write when we don't exceed the maximum body length
    if (this._requestBodyLength + data.length <= this._options.maxBodyLength) {
      this._requestBodyLength += data.length;
      this._requestBodyBuffers.push({ data: data, encoding: encoding });
      this._currentRequest.write(data, encoding, callback);
    }
    // Error when we exceed the maximum body length
    else {
      this.emit("error", new Error("Request body larger than maxBodyLength limit"));
      this.abort();
    }
  };

  // Ends the current native request
  RedirectableRequest.prototype.end = function (data, encoding, callback) {
    // Shift parameters if necessary
    if (typeof data === "function") {
      callback = data;
      data = encoding = null;
    }
    else if (typeof encoding === "function") {
      callback = encoding;
      encoding = null;
    }

    // Write data and end
    var currentRequest = this._currentRequest;
    this.write(data || "", encoding, function () {
      currentRequest.end(null, null, callback);
    });
  };

  // Sets a header value on the current native request
  RedirectableRequest.prototype.setHeader = function (name, value) {
    this._options.headers[name] = value;
    this._currentRequest.setHeader(name, value);
  };

  // Clears a header value on the current native request
  RedirectableRequest.prototype.removeHeader = function (name) {
    delete this._options.headers[name];
    this._currentRequest.removeHeader(name);
  };

  // Proxy all other public ClientRequest methods
  [
    "abort", "flushHeaders", "getHeader",
    "setNoDelay", "setSocketKeepAlive", "setTimeout",
  ].forEach(function (method) {
    RedirectableRequest.prototype[method] = function (a, b) {
      return this._currentRequest[method](a, b);
    };
  });

  // Proxy all public ClientRequest properties
  ["aborted", "connection", "socket"].forEach(function (property) {
    Object.defineProperty(RedirectableRequest.prototype, property, {
      get: function () { return this._currentRequest[property]; },
    });
  });

  // Executes the next native request (initial or redirect)
  RedirectableRequest.prototype._performRequest = function () {
    // Load the native protocol
    var protocol = this._options.protocol;
    var nativeProtocol = this._options.nativeProtocols[protocol];
    if (!nativeProtocol) {
      this.emit("error", new Error("Unsupported protocol " + protocol));
      return;
    }

    // If specified, use the agent corresponding to the protocol
    // (HTTP and HTTPS use different types of agents)
    if (this._options.agents) {
      var scheme = protocol.substr(0, protocol.length - 1);
      this._options.agent = this._options.agents[scheme];
    }

    // Create the native request
    var request = this._currentRequest =
          nativeProtocol.request(this._options, this._onNativeResponse);
    this._currentUrl = url.format(this._options);

    // Set up event handlers
    request._redirectable = this;
    for (var event in eventHandlers) {
      /* istanbul ignore else */
      if (event) {
        request.on(event, eventHandlers[event]);
      }
    }

    // End a redirected request
    // (The first request must be ended explicitly with RedirectableRequest#end)
    if (this._isRedirect) {
      // Write the request entity and end.
      var i = 0;
      var buffers = this._requestBodyBuffers;
      (function writeNext() {
        if (i < buffers.length) {
          var buffer = buffers[i++];
          request.write(buffer.data, buffer.encoding, writeNext);
        }
        else {
          request.end();
        }
      }());
    }
  };

  // Processes a response from the current native request
  RedirectableRequest.prototype._processResponse = function (response) {
    // Store the redirected response
    if (this._options.trackRedirects) {
      this._redirects.push({
        url: this._currentUrl,
        headers: response.headers,
        statusCode: response.statusCode,
      });
    }

    // RFC7231§6.4: The 3xx (Redirection) class of status code indicates
    // that further action needs to be taken by the user agent in order to
    // fulfill the request. If a Location header field is provided,
    // the user agent MAY automatically redirect its request to the URI
    // referenced by the Location field value,
    // even if the specific status code is not understood.
    var location = response.headers.location;
    if (location && this._options.followRedirects !== false &&
        response.statusCode >= 300 && response.statusCode < 400) {
      // RFC7231§6.4: A client SHOULD detect and intervene
      // in cyclical redirections (i.e., "infinite" redirection loops).
      if (++this._redirectCount > this._options.maxRedirects) {
        this.emit("error", new Error("Max redirects exceeded."));
        return;
      }

      // RFC7231§6.4: Automatic redirection needs to done with
      // care for methods not known to be safe […],
      // since the user might not wish to redirect an unsafe request.
      // RFC7231§6.4.7: The 307 (Temporary Redirect) status code indicates
      // that the target resource resides temporarily under a different URI
      // and the user agent MUST NOT change the request method
      // if it performs an automatic redirection to that URI.
      var header;
      var headers = this._options.headers;
      if (response.statusCode !== 307 && !(this._options.method in SAFE_METHODS)) {
        this._options.method = "GET";
        // Drop a possible entity and headers related to it
        this._requestBodyBuffers = [];
        for (header in headers) {
          if (/^content-/i.test(header)) {
            delete headers[header];
          }
        }
      }

      // Drop the Host header, as the redirect might lead to a different host
      if (!this._isRedirect) {
        for (header in headers) {
          if (/^host$/i.test(header)) {
            delete headers[header];
          }
        }
      }

      // Perform the redirected request
      var redirectUrl = url.resolve(this._currentUrl, location);
      debug$1("redirecting to", redirectUrl);
      Object.assign(this._options, url.parse(redirectUrl));
      this._isRedirect = true;
      this._performRequest();

      // Discard the remainder of the response to avoid waiting for data
      response.destroy();
    }
    else {
      // The response is not a redirect; return it as-is
      response.responseUrl = this._currentUrl;
      response.redirects = this._redirects;
      this.emit("response", response);

      // Clean up
      this._requestBodyBuffers = [];
    }
  };

  // Wraps the key/value object of protocols with redirect functionality
  function wrap(protocols) {
    // Default settings
    var exports = {
      maxRedirects: 21,
      maxBodyLength: 10 * 1024 * 1024,
    };

    // Wrap each protocol
    var nativeProtocols = {};
    Object.keys(protocols).forEach(function (scheme) {
      var protocol = scheme + ":";
      var nativeProtocol = nativeProtocols[protocol] = protocols[scheme];
      var wrappedProtocol = exports[scheme] = Object.create(nativeProtocol);

      // Executes a request, following redirects
      wrappedProtocol.request = function (options, callback) {
        if (typeof options === "string") {
          options = url.parse(options);
          options.maxRedirects = exports.maxRedirects;
        }
        else {
          options = Object.assign({
            protocol: protocol,
            maxRedirects: exports.maxRedirects,
            maxBodyLength: exports.maxBodyLength,
          }, options);
        }
        options.nativeProtocols = nativeProtocols;
        assert.equal(options.protocol, protocol, "protocol mismatch");
        debug$1("options", options);
        return new RedirectableRequest(options, callback);
      };

      // Executes a GET request, following redirects
      wrappedProtocol.get = function (options, callback) {
        var request = wrappedProtocol.request(options, callback);
        request.end();
        return request;
      };
    });
    return exports;
  }

  // Exports
  var followRedirects = wrap({ http: http, https: https });
  var wrap_1 = wrap;
  followRedirects.wrap = wrap_1;

  var name = "axios";
  var version = "0.19.0";
  var description = "Promise based HTTP client for the browser and node.js";
  var main = "index.js";
  var scripts = {
  	test: "grunt test && bundlesize",
  	start: "node ./sandbox/server.js",
  	build: "NODE_ENV=production grunt build",
  	preversion: "npm test",
  	version: "npm run build && grunt version && git add -A dist && git add CHANGELOG.md bower.json package.json",
  	postversion: "git push && git push --tags",
  	examples: "node ./examples/server.js",
  	coveralls: "cat coverage/lcov.info | ./node_modules/coveralls/bin/coveralls.js",
  	fix: "eslint --fix lib/**/*.js"
  };
  var repository = {
  	type: "git",
  	url: "https://github.com/axios/axios.git"
  };
  var keywords = [
  	"xhr",
  	"http",
  	"ajax",
  	"promise",
  	"node"
  ];
  var author = "Matt Zabriskie";
  var license = "MIT";
  var bugs = {
  	url: "https://github.com/axios/axios/issues"
  };
  var homepage = "https://github.com/axios/axios";
  var devDependencies = {
  	bundlesize: "^0.17.0",
  	coveralls: "^3.0.0",
  	"es6-promise": "^4.2.4",
  	grunt: "^1.0.2",
  	"grunt-banner": "^0.6.0",
  	"grunt-cli": "^1.2.0",
  	"grunt-contrib-clean": "^1.1.0",
  	"grunt-contrib-watch": "^1.0.0",
  	"grunt-eslint": "^20.1.0",
  	"grunt-karma": "^2.0.0",
  	"grunt-mocha-test": "^0.13.3",
  	"grunt-ts": "^6.0.0-beta.19",
  	"grunt-webpack": "^1.0.18",
  	"istanbul-instrumenter-loader": "^1.0.0",
  	"jasmine-core": "^2.4.1",
  	karma: "^1.3.0",
  	"karma-chrome-launcher": "^2.2.0",
  	"karma-coverage": "^1.1.1",
  	"karma-firefox-launcher": "^1.1.0",
  	"karma-jasmine": "^1.1.1",
  	"karma-jasmine-ajax": "^0.1.13",
  	"karma-opera-launcher": "^1.0.0",
  	"karma-safari-launcher": "^1.0.0",
  	"karma-sauce-launcher": "^1.2.0",
  	"karma-sinon": "^1.0.5",
  	"karma-sourcemap-loader": "^0.3.7",
  	"karma-webpack": "^1.7.0",
  	"load-grunt-tasks": "^3.5.2",
  	minimist: "^1.2.0",
  	mocha: "^5.2.0",
  	sinon: "^4.5.0",
  	typescript: "^2.8.1",
  	"url-search-params": "^0.10.0",
  	webpack: "^1.13.1",
  	"webpack-dev-server": "^1.14.1"
  };
  var browser$1 = {
  	"./lib/adapters/http.js": "./lib/adapters/xhr.js"
  };
  var typings = "./index.d.ts";
  var dependencies = {
  	"follow-redirects": "1.5.10",
  	"is-buffer": "^2.0.2"
  };
  var bundlesize = [
  	{
  		path: "./dist/axios.min.js",
  		threshold: "5kB"
  	}
  ];
  var _package = {
  	name: name,
  	version: version,
  	description: description,
  	main: main,
  	scripts: scripts,
  	repository: repository,
  	keywords: keywords,
  	author: author,
  	license: license,
  	bugs: bugs,
  	homepage: homepage,
  	devDependencies: devDependencies,
  	browser: browser$1,
  	typings: typings,
  	dependencies: dependencies,
  	bundlesize: bundlesize
  };

  var _package$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    name: name,
    version: version,
    description: description,
    main: main,
    scripts: scripts,
    repository: repository,
    keywords: keywords,
    author: author,
    license: license,
    bugs: bugs,
    homepage: homepage,
    devDependencies: devDependencies,
    browser: browser$1,
    typings: typings,
    dependencies: dependencies,
    bundlesize: bundlesize,
    'default': _package
  });

  var pkg = getCjsExportFromNamespace(_package$1);

  var httpFollow = followRedirects.http;
  var httpsFollow = followRedirects.https;






  var isHttps = /https:?/;

  /*eslint consistent-return:0*/
  var http_1 = function httpAdapter(config) {
    return new Promise(function dispatchHttpRequest(resolvePromise, rejectPromise) {
      var timer;
      var resolve = function resolve(value) {
        clearTimeout(timer);
        resolvePromise(value);
      };
      var reject = function reject(value) {
        clearTimeout(timer);
        rejectPromise(value);
      };
      var data = config.data;
      var headers = config.headers;

      // Set User-Agent (required by some servers)
      // Only set header if it hasn't been set in config
      // See https://github.com/axios/axios/issues/69
      if (!headers['User-Agent'] && !headers['user-agent']) {
        headers['User-Agent'] = 'axios/' + pkg.version;
      }

      if (data && !utils.isStream(data)) {
        if (Buffer.isBuffer(data)) ; else if (utils.isArrayBuffer(data)) {
          data = Buffer.from(new Uint8Array(data));
        } else if (utils.isString(data)) {
          data = Buffer.from(data, 'utf-8');
        } else {
          return reject(createError(
            'Data after transformation must be a string, an ArrayBuffer, a Buffer, or a Stream',
            config
          ));
        }

        // Add Content-Length header if data exists
        headers['Content-Length'] = data.length;
      }

      // HTTP basic authentication
      var auth = undefined;
      if (config.auth) {
        var username = config.auth.username || '';
        var password = config.auth.password || '';
        auth = username + ':' + password;
      }

      // Parse url
      var parsed = url.parse(config.url);
      var protocol = parsed.protocol || 'http:';

      if (!auth && parsed.auth) {
        var urlAuth = parsed.auth.split(':');
        var urlUsername = urlAuth[0] || '';
        var urlPassword = urlAuth[1] || '';
        auth = urlUsername + ':' + urlPassword;
      }

      if (auth) {
        delete headers.Authorization;
      }

      var isHttpsRequest = isHttps.test(protocol);
      var agent = isHttpsRequest ? config.httpsAgent : config.httpAgent;

      var options = {
        path: buildURL(parsed.path, config.params, config.paramsSerializer).replace(/^\?/, ''),
        method: config.method.toUpperCase(),
        headers: headers,
        agent: agent,
        auth: auth
      };

      if (config.socketPath) {
        options.socketPath = config.socketPath;
      } else {
        options.hostname = parsed.hostname;
        options.port = parsed.port;
      }

      var proxy = config.proxy;
      if (!proxy && proxy !== false) {
        var proxyEnv = protocol.slice(0, -1) + '_proxy';
        var proxyUrl = process.env[proxyEnv] || process.env[proxyEnv.toUpperCase()];
        if (proxyUrl) {
          var parsedProxyUrl = url.parse(proxyUrl);
          var noProxyEnv = process.env.no_proxy || process.env.NO_PROXY;
          var shouldProxy = true;

          if (noProxyEnv) {
            var noProxy = noProxyEnv.split(',').map(function trim(s) {
              return s.trim();
            });

            shouldProxy = !noProxy.some(function proxyMatch(proxyElement) {
              if (!proxyElement) {
                return false;
              }
              if (proxyElement === '*') {
                return true;
              }
              if (proxyElement[0] === '.' &&
                  parsed.hostname.substr(parsed.hostname.length - proxyElement.length) === proxyElement &&
                  proxyElement.match(/\./g).length === parsed.hostname.match(/\./g).length) {
                return true;
              }

              return parsed.hostname === proxyElement;
            });
          }


          if (shouldProxy) {
            proxy = {
              host: parsedProxyUrl.hostname,
              port: parsedProxyUrl.port
            };

            if (parsedProxyUrl.auth) {
              var proxyUrlAuth = parsedProxyUrl.auth.split(':');
              proxy.auth = {
                username: proxyUrlAuth[0],
                password: proxyUrlAuth[1]
              };
            }
          }
        }
      }

      if (proxy) {
        options.hostname = proxy.host;
        options.host = proxy.host;
        options.headers.host = parsed.hostname + (parsed.port ? ':' + parsed.port : '');
        options.port = proxy.port;
        options.path = protocol + '//' + parsed.hostname + (parsed.port ? ':' + parsed.port : '') + options.path;

        // Basic proxy authorization
        if (proxy.auth) {
          var base64 = Buffer.from(proxy.auth.username + ':' + proxy.auth.password, 'utf8').toString('base64');
          options.headers['Proxy-Authorization'] = 'Basic ' + base64;
        }
      }

      var transport;
      var isHttpsProxy = isHttpsRequest && (proxy ? isHttps.test(proxy.protocol) : true);
      if (config.transport) {
        transport = config.transport;
      } else if (config.maxRedirects === 0) {
        transport = isHttpsProxy ? https : http;
      } else {
        if (config.maxRedirects) {
          options.maxRedirects = config.maxRedirects;
        }
        transport = isHttpsProxy ? httpsFollow : httpFollow;
      }

      if (config.maxContentLength && config.maxContentLength > -1) {
        options.maxBodyLength = config.maxContentLength;
      }

      // Create the request
      var req = transport.request(options, function handleResponse(res) {
        if (req.aborted) return;

        // uncompress the response body transparently if required
        var stream = res;
        switch (res.headers['content-encoding']) {
        /*eslint default-case:0*/
        case 'gzip':
        case 'compress':
        case 'deflate':
          // add the unzipper to the body stream processing pipeline
          stream = (res.statusCode === 204) ? stream : stream.pipe(zlib.createUnzip());

          // remove the content-encoding in order to not confuse downstream operations
          delete res.headers['content-encoding'];
          break;
        }

        // return the last request in case of redirects
        var lastRequest = res.req || req;

        var response = {
          status: res.statusCode,
          statusText: res.statusMessage,
          headers: res.headers,
          config: config,
          request: lastRequest
        };

        if (config.responseType === 'stream') {
          response.data = stream;
          settle(resolve, reject, response);
        } else {
          var responseBuffer = [];
          stream.on('data', function handleStreamData(chunk) {
            responseBuffer.push(chunk);

            // make sure the content length is not over the maxContentLength if specified
            if (config.maxContentLength > -1 && Buffer.concat(responseBuffer).length > config.maxContentLength) {
              stream.destroy();
              reject(createError('maxContentLength size of ' + config.maxContentLength + ' exceeded',
                config, null, lastRequest));
            }
          });

          stream.on('error', function handleStreamError(err) {
            if (req.aborted) return;
            reject(enhanceError(err, config, null, lastRequest));
          });

          stream.on('end', function handleStreamEnd() {
            var responseData = Buffer.concat(responseBuffer);
            if (config.responseType !== 'arraybuffer') {
              responseData = responseData.toString(config.responseEncoding);
            }

            response.data = responseData;
            settle(resolve, reject, response);
          });
        }
      });

      // Handle errors
      req.on('error', function handleRequestError(err) {
        if (req.aborted) return;
        reject(enhanceError(err, config, null, req));
      });

      // Handle request timeout
      if (config.timeout) {
        timer = setTimeout(function handleRequestTimeout() {
          req.abort();
          reject(createError('timeout of ' + config.timeout + 'ms exceeded', config, 'ECONNABORTED', req));
        }, config.timeout);
      }

      if (config.cancelToken) {
        // Handle cancellation
        config.cancelToken.promise.then(function onCanceled(cancel) {
          if (req.aborted) return;

          req.abort();
          reject(cancel);
        });
      }

      // Send the request
      if (utils.isStream(data)) {
        data.on('error', function handleStreamError(err) {
          reject(enhanceError(err, config, null, req));
        }).pipe(req);
      } else {
        req.end(data);
      }
    });
  };

  // Headers whose duplicates are ignored by node
  // c.f. https://nodejs.org/api/http.html#http_message_headers
  var ignoreDuplicateOf = [
    'age', 'authorization', 'content-length', 'content-type', 'etag',
    'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',
    'last-modified', 'location', 'max-forwards', 'proxy-authorization',
    'referer', 'retry-after', 'user-agent'
  ];

  /**
   * Parse headers into an object
   *
   * ```
   * Date: Wed, 27 Aug 2014 08:58:49 GMT
   * Content-Type: application/json
   * Connection: keep-alive
   * Transfer-Encoding: chunked
   * ```
   *
   * @param {String} headers Headers needing to be parsed
   * @returns {Object} Headers parsed into an object
   */
  var parseHeaders = function parseHeaders(headers) {
    var parsed = {};
    var key;
    var val;
    var i;

    if (!headers) { return parsed; }

    utils.forEach(headers.split('\n'), function parser(line) {
      i = line.indexOf(':');
      key = utils.trim(line.substr(0, i)).toLowerCase();
      val = utils.trim(line.substr(i + 1));

      if (key) {
        if (parsed[key] && ignoreDuplicateOf.indexOf(key) >= 0) {
          return;
        }
        if (key === 'set-cookie') {
          parsed[key] = (parsed[key] ? parsed[key] : []).concat([val]);
        } else {
          parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
        }
      }
    });

    return parsed;
  };

  var isURLSameOrigin = (
    utils.isStandardBrowserEnv() ?

    // Standard browser envs have full support of the APIs needed to test
    // whether the request URL is of the same origin as current location.
      (function standardBrowserEnv() {
        var msie = /(msie|trident)/i.test(navigator.userAgent);
        var urlParsingNode = document.createElement('a');
        var originURL;

        /**
      * Parse a URL to discover it's components
      *
      * @param {String} url The URL to be parsed
      * @returns {Object}
      */
        function resolveURL(url) {
          var href = url;

          if (msie) {
          // IE needs attribute set twice to normalize properties
            urlParsingNode.setAttribute('href', href);
            href = urlParsingNode.href;
          }

          urlParsingNode.setAttribute('href', href);

          // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
          return {
            href: urlParsingNode.href,
            protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
            host: urlParsingNode.host,
            search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
            hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
            hostname: urlParsingNode.hostname,
            port: urlParsingNode.port,
            pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
              urlParsingNode.pathname :
              '/' + urlParsingNode.pathname
          };
        }

        originURL = resolveURL(window.location.href);

        /**
      * Determine if a URL shares the same origin as the current location
      *
      * @param {String} requestURL The URL to test
      * @returns {boolean} True if URL shares the same origin, otherwise false
      */
        return function isURLSameOrigin(requestURL) {
          var parsed = (utils.isString(requestURL)) ? resolveURL(requestURL) : requestURL;
          return (parsed.protocol === originURL.protocol &&
              parsed.host === originURL.host);
        };
      })() :

    // Non standard browser envs (web workers, react-native) lack needed support.
      (function nonStandardBrowserEnv() {
        return function isURLSameOrigin() {
          return true;
        };
      })()
  );

  var cookies = (
    utils.isStandardBrowserEnv() ?

    // Standard browser envs support document.cookie
      (function standardBrowserEnv() {
        return {
          write: function write(name, value, expires, path, domain, secure) {
            var cookie = [];
            cookie.push(name + '=' + encodeURIComponent(value));

            if (utils.isNumber(expires)) {
              cookie.push('expires=' + new Date(expires).toGMTString());
            }

            if (utils.isString(path)) {
              cookie.push('path=' + path);
            }

            if (utils.isString(domain)) {
              cookie.push('domain=' + domain);
            }

            if (secure === true) {
              cookie.push('secure');
            }

            document.cookie = cookie.join('; ');
          },

          read: function read(name) {
            var match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
            return (match ? decodeURIComponent(match[3]) : null);
          },

          remove: function remove(name) {
            this.write(name, '', Date.now() - 86400000);
          }
        };
      })() :

    // Non standard browser env (web workers, react-native) lack needed support.
      (function nonStandardBrowserEnv() {
        return {
          write: function write() {},
          read: function read() { return null; },
          remove: function remove() {}
        };
      })()
  );

  var xhr = function xhrAdapter(config) {
    return new Promise(function dispatchXhrRequest(resolve, reject) {
      var requestData = config.data;
      var requestHeaders = config.headers;

      if (utils.isFormData(requestData)) {
        delete requestHeaders['Content-Type']; // Let the browser set it
      }

      var request = new XMLHttpRequest();

      // HTTP basic authentication
      if (config.auth) {
        var username = config.auth.username || '';
        var password = config.auth.password || '';
        requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);
      }

      request.open(config.method.toUpperCase(), buildURL(config.url, config.params, config.paramsSerializer), true);

      // Set the request timeout in MS
      request.timeout = config.timeout;

      // Listen for ready state
      request.onreadystatechange = function handleLoad() {
        if (!request || request.readyState !== 4) {
          return;
        }

        // The request errored out and we didn't get a response, this will be
        // handled by onerror instead
        // With one exception: request that using file: protocol, most browsers
        // will return status as 0 even though it's a successful request
        if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
          return;
        }

        // Prepare the response
        var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
        var responseData = !config.responseType || config.responseType === 'text' ? request.responseText : request.response;
        var response = {
          data: responseData,
          status: request.status,
          statusText: request.statusText,
          headers: responseHeaders,
          config: config,
          request: request
        };

        settle(resolve, reject, response);

        // Clean up request
        request = null;
      };

      // Handle browser request cancellation (as opposed to a manual cancellation)
      request.onabort = function handleAbort() {
        if (!request) {
          return;
        }

        reject(createError('Request aborted', config, 'ECONNABORTED', request));

        // Clean up request
        request = null;
      };

      // Handle low level network errors
      request.onerror = function handleError() {
        // Real errors are hidden from us by the browser
        // onerror should only fire if it's a network error
        reject(createError('Network Error', config, null, request));

        // Clean up request
        request = null;
      };

      // Handle timeout
      request.ontimeout = function handleTimeout() {
        reject(createError('timeout of ' + config.timeout + 'ms exceeded', config, 'ECONNABORTED',
          request));

        // Clean up request
        request = null;
      };

      // Add xsrf header
      // This is only done if running in a standard browser environment.
      // Specifically not if we're in a web worker, or react-native.
      if (utils.isStandardBrowserEnv()) {
        var cookies$1 = cookies;

        // Add xsrf header
        var xsrfValue = (config.withCredentials || isURLSameOrigin(config.url)) && config.xsrfCookieName ?
          cookies$1.read(config.xsrfCookieName) :
          undefined;

        if (xsrfValue) {
          requestHeaders[config.xsrfHeaderName] = xsrfValue;
        }
      }

      // Add headers to the request
      if ('setRequestHeader' in request) {
        utils.forEach(requestHeaders, function setRequestHeader(val, key) {
          if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {
            // Remove Content-Type if data is undefined
            delete requestHeaders[key];
          } else {
            // Otherwise add header to the request
            request.setRequestHeader(key, val);
          }
        });
      }

      // Add withCredentials to request if needed
      if (config.withCredentials) {
        request.withCredentials = true;
      }

      // Add responseType to request if needed
      if (config.responseType) {
        try {
          request.responseType = config.responseType;
        } catch (e) {
          // Expected DOMException thrown by browsers not compatible XMLHttpRequest Level 2.
          // But, this can be suppressed for 'json' type as it can be parsed by default 'transformResponse' function.
          if (config.responseType !== 'json') {
            throw e;
          }
        }
      }

      // Handle progress if needed
      if (typeof config.onDownloadProgress === 'function') {
        request.addEventListener('progress', config.onDownloadProgress);
      }

      // Not all browsers support upload events
      if (typeof config.onUploadProgress === 'function' && request.upload) {
        request.upload.addEventListener('progress', config.onUploadProgress);
      }

      if (config.cancelToken) {
        // Handle cancellation
        config.cancelToken.promise.then(function onCanceled(cancel) {
          if (!request) {
            return;
          }

          request.abort();
          reject(cancel);
          // Clean up request
          request = null;
        });
      }

      if (requestData === undefined) {
        requestData = null;
      }

      // Send the request
      request.send(requestData);
    });
  };

  var DEFAULT_CONTENT_TYPE = {
    'Content-Type': 'application/x-www-form-urlencoded'
  };

  function setContentTypeIfUnset(headers, value) {
    if (!utils.isUndefined(headers) && utils.isUndefined(headers['Content-Type'])) {
      headers['Content-Type'] = value;
    }
  }

  function getDefaultAdapter() {
    var adapter;
    // Only Node.JS has a process variable that is of [[Class]] process
    if (typeof process !== 'undefined' && Object.prototype.toString.call(process) === '[object process]') {
      // For node use HTTP adapter
      adapter = http_1;
    } else if (typeof XMLHttpRequest !== 'undefined') {
      // For browsers use XHR adapter
      adapter = xhr;
    }
    return adapter;
  }

  var defaults = {
    adapter: getDefaultAdapter(),

    transformRequest: [function transformRequest(data, headers) {
      normalizeHeaderName(headers, 'Accept');
      normalizeHeaderName(headers, 'Content-Type');
      if (utils.isFormData(data) ||
        utils.isArrayBuffer(data) ||
        utils.isBuffer(data) ||
        utils.isStream(data) ||
        utils.isFile(data) ||
        utils.isBlob(data)
      ) {
        return data;
      }
      if (utils.isArrayBufferView(data)) {
        return data.buffer;
      }
      if (utils.isURLSearchParams(data)) {
        setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
        return data.toString();
      }
      if (utils.isObject(data)) {
        setContentTypeIfUnset(headers, 'application/json;charset=utf-8');
        return JSON.stringify(data);
      }
      return data;
    }],

    transformResponse: [function transformResponse(data) {
      /*eslint no-param-reassign:0*/
      if (typeof data === 'string') {
        try {
          data = JSON.parse(data);
        } catch (e) { /* Ignore */ }
      }
      return data;
    }],

    /**
     * A timeout in milliseconds to abort a request. If set to 0 (default) a
     * timeout is not created.
     */
    timeout: 0,

    xsrfCookieName: 'XSRF-TOKEN',
    xsrfHeaderName: 'X-XSRF-TOKEN',

    maxContentLength: -1,

    validateStatus: function validateStatus(status) {
      return status >= 200 && status < 300;
    }
  };

  defaults.headers = {
    common: {
      'Accept': 'application/json, text/plain, */*'
    }
  };

  utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
    defaults.headers[method] = {};
  });

  utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
    defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
  });

  var defaults_1 = defaults;

  /**
   * Determines whether the specified URL is absolute
   *
   * @param {string} url The URL to test
   * @returns {boolean} True if the specified URL is absolute, otherwise false
   */
  var isAbsoluteURL = function isAbsoluteURL(url) {
    // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
    // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
    // by any combination of letters, digits, plus, period, or hyphen.
    return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
  };

  /**
   * Creates a new URL by combining the specified URLs
   *
   * @param {string} baseURL The base URL
   * @param {string} relativeURL The relative URL
   * @returns {string} The combined URL
   */
  var combineURLs = function combineURLs(baseURL, relativeURL) {
    return relativeURL
      ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
      : baseURL;
  };

  /**
   * Throws a `Cancel` if cancellation has been requested.
   */
  function throwIfCancellationRequested(config) {
    if (config.cancelToken) {
      config.cancelToken.throwIfRequested();
    }
  }

  /**
   * Dispatch a request to the server using the configured adapter.
   *
   * @param {object} config The config that is to be used for the request
   * @returns {Promise} The Promise to be fulfilled
   */
  var dispatchRequest = function dispatchRequest(config) {
    throwIfCancellationRequested(config);

    // Support baseURL config
    if (config.baseURL && !isAbsoluteURL(config.url)) {
      config.url = combineURLs(config.baseURL, config.url);
    }

    // Ensure headers exist
    config.headers = config.headers || {};

    // Transform request data
    config.data = transformData(
      config.data,
      config.headers,
      config.transformRequest
    );

    // Flatten headers
    config.headers = utils.merge(
      config.headers.common || {},
      config.headers[config.method] || {},
      config.headers || {}
    );

    utils.forEach(
      ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
      function cleanHeaderConfig(method) {
        delete config.headers[method];
      }
    );

    var adapter = config.adapter || defaults_1.adapter;

    return adapter(config).then(function onAdapterResolution(response) {
      throwIfCancellationRequested(config);

      // Transform response data
      response.data = transformData(
        response.data,
        response.headers,
        config.transformResponse
      );

      return response;
    }, function onAdapterRejection(reason) {
      if (!isCancel(reason)) {
        throwIfCancellationRequested(config);

        // Transform response data
        if (reason && reason.response) {
          reason.response.data = transformData(
            reason.response.data,
            reason.response.headers,
            config.transformResponse
          );
        }
      }

      return Promise.reject(reason);
    });
  };

  /**
   * Config-specific merge-function which creates a new config-object
   * by merging two configuration objects together.
   *
   * @param {Object} config1
   * @param {Object} config2
   * @returns {Object} New object resulting from merging config2 to config1
   */
  var mergeConfig = function mergeConfig(config1, config2) {
    // eslint-disable-next-line no-param-reassign
    config2 = config2 || {};
    var config = {};

    utils.forEach(['url', 'method', 'params', 'data'], function valueFromConfig2(prop) {
      if (typeof config2[prop] !== 'undefined') {
        config[prop] = config2[prop];
      }
    });

    utils.forEach(['headers', 'auth', 'proxy'], function mergeDeepProperties(prop) {
      if (utils.isObject(config2[prop])) {
        config[prop] = utils.deepMerge(config1[prop], config2[prop]);
      } else if (typeof config2[prop] !== 'undefined') {
        config[prop] = config2[prop];
      } else if (utils.isObject(config1[prop])) {
        config[prop] = utils.deepMerge(config1[prop]);
      } else if (typeof config1[prop] !== 'undefined') {
        config[prop] = config1[prop];
      }
    });

    utils.forEach([
      'baseURL', 'transformRequest', 'transformResponse', 'paramsSerializer',
      'timeout', 'withCredentials', 'adapter', 'responseType', 'xsrfCookieName',
      'xsrfHeaderName', 'onUploadProgress', 'onDownloadProgress', 'maxContentLength',
      'validateStatus', 'maxRedirects', 'httpAgent', 'httpsAgent', 'cancelToken',
      'socketPath'
    ], function defaultToConfig2(prop) {
      if (typeof config2[prop] !== 'undefined') {
        config[prop] = config2[prop];
      } else if (typeof config1[prop] !== 'undefined') {
        config[prop] = config1[prop];
      }
    });

    return config;
  };

  /**
   * Create a new instance of Axios
   *
   * @param {Object} instanceConfig The default config for the instance
   */
  function Axios(instanceConfig) {
    this.defaults = instanceConfig;
    this.interceptors = {
      request: new InterceptorManager_1(),
      response: new InterceptorManager_1()
    };
  }

  /**
   * Dispatch a request
   *
   * @param {Object} config The config specific for this request (merged with this.defaults)
   */
  Axios.prototype.request = function request(config) {
    /*eslint no-param-reassign:0*/
    // Allow for axios('example/url'[, config]) a la fetch API
    if (typeof config === 'string') {
      config = arguments[1] || {};
      config.url = arguments[0];
    } else {
      config = config || {};
    }

    config = mergeConfig(this.defaults, config);
    config.method = config.method ? config.method.toLowerCase() : 'get';

    // Hook up interceptors middleware
    var chain = [dispatchRequest, undefined];
    var promise = Promise.resolve(config);

    this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
      chain.unshift(interceptor.fulfilled, interceptor.rejected);
    });

    this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
      chain.push(interceptor.fulfilled, interceptor.rejected);
    });

    while (chain.length) {
      promise = promise.then(chain.shift(), chain.shift());
    }

    return promise;
  };

  Axios.prototype.getUri = function getUri(config) {
    config = mergeConfig(this.defaults, config);
    return buildURL(config.url, config.params, config.paramsSerializer).replace(/^\?/, '');
  };

  // Provide aliases for supported request methods
  utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
    /*eslint func-names:0*/
    Axios.prototype[method] = function(url, config) {
      return this.request(utils.merge(config || {}, {
        method: method,
        url: url
      }));
    };
  });

  utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
    /*eslint func-names:0*/
    Axios.prototype[method] = function(url, data, config) {
      return this.request(utils.merge(config || {}, {
        method: method,
        url: url,
        data: data
      }));
    };
  });

  var Axios_1 = Axios;

  /**
   * A `Cancel` is an object that is thrown when an operation is canceled.
   *
   * @class
   * @param {string=} message The message.
   */
  function Cancel(message) {
    this.message = message;
  }

  Cancel.prototype.toString = function toString() {
    return 'Cancel' + (this.message ? ': ' + this.message : '');
  };

  Cancel.prototype.__CANCEL__ = true;

  var Cancel_1 = Cancel;

  /**
   * A `CancelToken` is an object that can be used to request cancellation of an operation.
   *
   * @class
   * @param {Function} executor The executor function.
   */
  function CancelToken(executor) {
    if (typeof executor !== 'function') {
      throw new TypeError('executor must be a function.');
    }

    var resolvePromise;
    this.promise = new Promise(function promiseExecutor(resolve) {
      resolvePromise = resolve;
    });

    var token = this;
    executor(function cancel(message) {
      if (token.reason) {
        // Cancellation has already been requested
        return;
      }

      token.reason = new Cancel_1(message);
      resolvePromise(token.reason);
    });
  }

  /**
   * Throws a `Cancel` if cancellation has been requested.
   */
  CancelToken.prototype.throwIfRequested = function throwIfRequested() {
    if (this.reason) {
      throw this.reason;
    }
  };

  /**
   * Returns an object that contains a new `CancelToken` and a function that, when called,
   * cancels the `CancelToken`.
   */
  CancelToken.source = function source() {
    var cancel;
    var token = new CancelToken(function executor(c) {
      cancel = c;
    });
    return {
      token: token,
      cancel: cancel
    };
  };

  var CancelToken_1 = CancelToken;

  /**
   * Syntactic sugar for invoking a function and expanding an array for arguments.
   *
   * Common use case would be to use `Function.prototype.apply`.
   *
   *  ```js
   *  function f(x, y, z) {}
   *  var args = [1, 2, 3];
   *  f.apply(null, args);
   *  ```
   *
   * With `spread` this example can be re-written.
   *
   *  ```js
   *  spread(function(x, y, z) {})([1, 2, 3]);
   *  ```
   *
   * @param {Function} callback
   * @returns {Function}
   */
  var spread = function spread(callback) {
    return function wrap(arr) {
      return callback.apply(null, arr);
    };
  };

  /**
   * Create an instance of Axios
   *
   * @param {Object} defaultConfig The default config for the instance
   * @return {Axios} A new instance of Axios
   */
  function createInstance(defaultConfig) {
    var context = new Axios_1(defaultConfig);
    var instance = bind(Axios_1.prototype.request, context);

    // Copy axios.prototype to instance
    utils.extend(instance, Axios_1.prototype, context);

    // Copy context to instance
    utils.extend(instance, context);

    return instance;
  }

  // Create the default instance to be exported
  var axios = createInstance(defaults_1);

  // Expose Axios class to allow class inheritance
  axios.Axios = Axios_1;

  // Factory for creating new instances
  axios.create = function create(instanceConfig) {
    return createInstance(mergeConfig(axios.defaults, instanceConfig));
  };

  // Expose Cancel & CancelToken
  axios.Cancel = Cancel_1;
  axios.CancelToken = CancelToken_1;
  axios.isCancel = isCancel;

  // Expose all/spread
  axios.all = function all(promises) {
    return Promise.all(promises);
  };
  axios.spread = spread;

  var axios_1 = axios;

  // Allow use of default import syntax in TypeScript
  var default_1 = axios;
  axios_1.default = default_1;

  var axios$1 = axios_1;

  var js_cookie = createCommonjsModule(function (module, exports) {
  (function (factory) {
  	var registeredInModuleLoader;
  	{
  		module.exports = factory();
  		registeredInModuleLoader = true;
  	}
  	if (!registeredInModuleLoader) {
  		var OldCookies = window.Cookies;
  		var api = window.Cookies = factory();
  		api.noConflict = function () {
  			window.Cookies = OldCookies;
  			return api;
  		};
  	}
  }(function () {
  	function extend () {
  		var i = 0;
  		var result = {};
  		for (; i < arguments.length; i++) {
  			var attributes = arguments[ i ];
  			for (var key in attributes) {
  				result[key] = attributes[key];
  			}
  		}
  		return result;
  	}

  	function decode (s) {
  		return s.replace(/(%[0-9A-Z]{2})+/g, decodeURIComponent);
  	}

  	function init (converter) {
  		function api() {}

  		function set (key, value, attributes) {
  			if (typeof document === 'undefined') {
  				return;
  			}

  			attributes = extend({
  				path: '/'
  			}, api.defaults, attributes);

  			if (typeof attributes.expires === 'number') {
  				attributes.expires = new Date(new Date() * 1 + attributes.expires * 864e+5);
  			}

  			// We're using "expires" because "max-age" is not supported by IE
  			attributes.expires = attributes.expires ? attributes.expires.toUTCString() : '';

  			try {
  				var result = JSON.stringify(value);
  				if (/^[\{\[]/.test(result)) {
  					value = result;
  				}
  			} catch (e) {}

  			value = converter.write ?
  				converter.write(value, key) :
  				encodeURIComponent(String(value))
  					.replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g, decodeURIComponent);

  			key = encodeURIComponent(String(key))
  				.replace(/%(23|24|26|2B|5E|60|7C)/g, decodeURIComponent)
  				.replace(/[\(\)]/g, escape);

  			var stringifiedAttributes = '';
  			for (var attributeName in attributes) {
  				if (!attributes[attributeName]) {
  					continue;
  				}
  				stringifiedAttributes += '; ' + attributeName;
  				if (attributes[attributeName] === true) {
  					continue;
  				}

  				// Considers RFC 6265 section 5.2:
  				// ...
  				// 3.  If the remaining unparsed-attributes contains a %x3B (";")
  				//     character:
  				// Consume the characters of the unparsed-attributes up to,
  				// not including, the first %x3B (";") character.
  				// ...
  				stringifiedAttributes += '=' + attributes[attributeName].split(';')[0];
  			}

  			return (document.cookie = key + '=' + value + stringifiedAttributes);
  		}

  		function get (key, json) {
  			if (typeof document === 'undefined') {
  				return;
  			}

  			var jar = {};
  			// To prevent the for loop in the first place assign an empty array
  			// in case there are no cookies at all.
  			var cookies = document.cookie ? document.cookie.split('; ') : [];
  			var i = 0;

  			for (; i < cookies.length; i++) {
  				var parts = cookies[i].split('=');
  				var cookie = parts.slice(1).join('=');

  				if (!json && cookie.charAt(0) === '"') {
  					cookie = cookie.slice(1, -1);
  				}

  				try {
  					var name = decode(parts[0]);
  					cookie = (converter.read || converter)(cookie, name) ||
  						decode(cookie);

  					if (json) {
  						try {
  							cookie = JSON.parse(cookie);
  						} catch (e) {}
  					}

  					jar[name] = cookie;

  					if (key === name) {
  						break;
  					}
  				} catch (e) {}
  			}

  			return key ? jar[key] : jar;
  		}

  		api.set = set;
  		api.get = function (key) {
  			return get(key, false /* read as raw */);
  		};
  		api.getJSON = function (key) {
  			return get(key, true /* read as json */);
  		};
  		api.remove = function (key, attributes) {
  			set(key, '', extend(attributes, {
  				expires: -1
  			}));
  		};

  		api.defaults = {};

  		api.withConverter = init;

  		return api;
  	}

  	return init(function () {});
  }));
  });

  var merge$1 = createCommonjsModule(function (module, exports) {

  exports.__esModule = true;

  exports.default = function (target) {
    for (var i = 1, j = arguments.length; i < j; i++) {
      var source = arguments[i] || {};
      for (var prop in source) {
        if (source.hasOwnProperty(prop)) {
          var value = source[prop];
          if (value !== undefined) {
            target[prop] = value;
          }
        }
      }
    }

    return target;
  };
  });

  unwrapExports(merge$1);

  var dom = createCommonjsModule(function (module, exports) {

  exports.__esModule = true;
  exports.isInContainer = exports.getScrollContainer = exports.isScroll = exports.getStyle = exports.once = exports.off = exports.on = undefined;

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; /* istanbul ignore next */

  exports.hasClass = hasClass;
  exports.addClass = addClass;
  exports.removeClass = removeClass;
  exports.setStyle = setStyle;



  var _vue2 = _interopRequireDefault(vue);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  var isServer = _vue2.default.prototype.$isServer;
  var SPECIAL_CHARS_REGEXP = /([\:\-\_]+(.))/g;
  var MOZ_HACK_REGEXP = /^moz([A-Z])/;
  var ieVersion = isServer ? 0 : Number(document.documentMode);

  /* istanbul ignore next */
  var trim = function trim(string) {
    return (string || '').replace(/^[\s\uFEFF]+|[\s\uFEFF]+$/g, '');
  };
  /* istanbul ignore next */
  var camelCase = function camelCase(name) {
    return name.replace(SPECIAL_CHARS_REGEXP, function (_, separator, letter, offset) {
      return offset ? letter.toUpperCase() : letter;
    }).replace(MOZ_HACK_REGEXP, 'Moz$1');
  };

  /* istanbul ignore next */
  var on = exports.on = function () {
    if (!isServer && document.addEventListener) {
      return function (element, event, handler) {
        if (element && event && handler) {
          element.addEventListener(event, handler, false);
        }
      };
    } else {
      return function (element, event, handler) {
        if (element && event && handler) {
          element.attachEvent('on' + event, handler);
        }
      };
    }
  }();

  /* istanbul ignore next */
  var off = exports.off = function () {
    if (!isServer && document.removeEventListener) {
      return function (element, event, handler) {
        if (element && event) {
          element.removeEventListener(event, handler, false);
        }
      };
    } else {
      return function (element, event, handler) {
        if (element && event) {
          element.detachEvent('on' + event, handler);
        }
      };
    }
  }();

  /* istanbul ignore next */
  var once = exports.once = function once(el, event, fn) {
    var listener = function listener() {
      if (fn) {
        fn.apply(this, arguments);
      }
      off(el, event, listener);
    };
    on(el, event, listener);
  };

  /* istanbul ignore next */
  function hasClass(el, cls) {
    if (!el || !cls) return false;
    if (cls.indexOf(' ') !== -1) throw new Error('className should not contain space.');
    if (el.classList) {
      return el.classList.contains(cls);
    } else {
      return (' ' + el.className + ' ').indexOf(' ' + cls + ' ') > -1;
    }
  }
  /* istanbul ignore next */
  function addClass(el, cls) {
    if (!el) return;
    var curClass = el.className;
    var classes = (cls || '').split(' ');

    for (var i = 0, j = classes.length; i < j; i++) {
      var clsName = classes[i];
      if (!clsName) continue;

      if (el.classList) {
        el.classList.add(clsName);
      } else if (!hasClass(el, clsName)) {
        curClass += ' ' + clsName;
      }
    }
    if (!el.classList) {
      el.className = curClass;
    }
  }
  /* istanbul ignore next */
  function removeClass(el, cls) {
    if (!el || !cls) return;
    var classes = cls.split(' ');
    var curClass = ' ' + el.className + ' ';

    for (var i = 0, j = classes.length; i < j; i++) {
      var clsName = classes[i];
      if (!clsName) continue;

      if (el.classList) {
        el.classList.remove(clsName);
      } else if (hasClass(el, clsName)) {
        curClass = curClass.replace(' ' + clsName + ' ', ' ');
      }
    }
    if (!el.classList) {
      el.className = trim(curClass);
    }
  }
  /* istanbul ignore next */
  var getStyle = exports.getStyle = ieVersion < 9 ? function (element, styleName) {
    if (isServer) return;
    if (!element || !styleName) return null;
    styleName = camelCase(styleName);
    if (styleName === 'float') {
      styleName = 'styleFloat';
    }
    try {
      switch (styleName) {
        case 'opacity':
          try {
            return element.filters.item('alpha').opacity / 100;
          } catch (e) {
            return 1.0;
          }
        default:
          return element.style[styleName] || element.currentStyle ? element.currentStyle[styleName] : null;
      }
    } catch (e) {
      return element.style[styleName];
    }
  } : function (element, styleName) {
    if (isServer) return;
    if (!element || !styleName) return null;
    styleName = camelCase(styleName);
    if (styleName === 'float') {
      styleName = 'cssFloat';
    }
    try {
      var computed = document.defaultView.getComputedStyle(element, '');
      return element.style[styleName] || computed ? computed[styleName] : null;
    } catch (e) {
      return element.style[styleName];
    }
  };

  /* istanbul ignore next */
  function setStyle(element, styleName, value) {
    if (!element || !styleName) return;

    if ((typeof styleName === 'undefined' ? 'undefined' : _typeof(styleName)) === 'object') {
      for (var prop in styleName) {
        if (styleName.hasOwnProperty(prop)) {
          setStyle(element, prop, styleName[prop]);
        }
      }
    } else {
      styleName = camelCase(styleName);
      if (styleName === 'opacity' && ieVersion < 9) {
        element.style.filter = isNaN(value) ? '' : 'alpha(opacity=' + value * 100 + ')';
      } else {
        element.style[styleName] = value;
      }
    }
  }
  var isScroll = exports.isScroll = function isScroll(el, vertical) {
    if (isServer) return;

    var determinedDirection = vertical !== null || vertical !== undefined;
    var overflow = determinedDirection ? vertical ? getStyle(el, 'overflow-y') : getStyle(el, 'overflow-x') : getStyle(el, 'overflow');

    return overflow.match(/(scroll|auto)/);
  };

  var getScrollContainer = exports.getScrollContainer = function getScrollContainer(el, vertical) {
    if (isServer) return;

    var parent = el;
    while (parent) {
      if ([window, document, document.documentElement].includes(parent)) {
        return window;
      }
      if (isScroll(parent, vertical)) {
        return parent;
      }
      parent = parent.parentNode;
    }

    return parent;
  };

  var isInContainer = exports.isInContainer = function isInContainer(el, container) {
    if (isServer || !el || !container) return false;

    var elRect = el.getBoundingClientRect();
    var containerRect = void 0;

    if ([window, document, document.documentElement, null, undefined].includes(container)) {
      containerRect = {
        top: 0,
        right: window.innerWidth,
        bottom: window.innerHeight,
        left: 0
      };
    } else {
      containerRect = container.getBoundingClientRect();
    }

    return elRect.top < containerRect.bottom && elRect.bottom > containerRect.top && elRect.right > containerRect.left && elRect.left < containerRect.right;
  };
  });

  unwrapExports(dom);
  var dom_1 = dom.isInContainer;
  var dom_2 = dom.getScrollContainer;
  var dom_3 = dom.isScroll;
  var dom_4 = dom.getStyle;
  var dom_5 = dom.once;
  var dom_6 = dom.off;
  var dom_7 = dom.on;
  var dom_8 = dom.hasClass;
  var dom_9 = dom.addClass;
  var dom_10 = dom.removeClass;
  var dom_11 = dom.setStyle;

  var popupManager = createCommonjsModule(function (module, exports) {

  exports.__esModule = true;



  var _vue2 = _interopRequireDefault(vue);



  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  var hasModal = false;
  var hasInitZIndex = false;
  var zIndex = void 0;

  var getModal = function getModal() {
    if (_vue2.default.prototype.$isServer) return;
    var modalDom = PopupManager.modalDom;
    if (modalDom) {
      hasModal = true;
    } else {
      hasModal = false;
      modalDom = document.createElement('div');
      PopupManager.modalDom = modalDom;

      modalDom.addEventListener('touchmove', function (event) {
        event.preventDefault();
        event.stopPropagation();
      });

      modalDom.addEventListener('click', function () {
        PopupManager.doOnModalClick && PopupManager.doOnModalClick();
      });
    }

    return modalDom;
  };

  var instances = {};

  var PopupManager = {
    modalFade: true,

    getInstance: function getInstance(id) {
      return instances[id];
    },

    register: function register(id, instance) {
      if (id && instance) {
        instances[id] = instance;
      }
    },

    deregister: function deregister(id) {
      if (id) {
        instances[id] = null;
        delete instances[id];
      }
    },

    nextZIndex: function nextZIndex() {
      return PopupManager.zIndex++;
    },

    modalStack: [],

    doOnModalClick: function doOnModalClick() {
      var topItem = PopupManager.modalStack[PopupManager.modalStack.length - 1];
      if (!topItem) return;

      var instance = PopupManager.getInstance(topItem.id);
      if (instance && instance.closeOnClickModal) {
        instance.close();
      }
    },

    openModal: function openModal(id, zIndex, dom$1, modalClass, modalFade) {
      if (_vue2.default.prototype.$isServer) return;
      if (!id || zIndex === undefined) return;
      this.modalFade = modalFade;

      var modalStack = this.modalStack;

      for (var i = 0, j = modalStack.length; i < j; i++) {
        var item = modalStack[i];
        if (item.id === id) {
          return;
        }
      }

      var modalDom = getModal();

      (0, dom.addClass)(modalDom, 'v-modal');
      if (this.modalFade && !hasModal) {
        (0, dom.addClass)(modalDom, 'v-modal-enter');
      }
      if (modalClass) {
        var classArr = modalClass.trim().split(/\s+/);
        classArr.forEach(function (item) {
          return (0, dom.addClass)(modalDom, item);
        });
      }
      setTimeout(function () {
        (0, dom.removeClass)(modalDom, 'v-modal-enter');
      }, 200);

      if (dom$1 && dom$1.parentNode && dom$1.parentNode.nodeType !== 11) {
        dom$1.parentNode.appendChild(modalDom);
      } else {
        document.body.appendChild(modalDom);
      }

      if (zIndex) {
        modalDom.style.zIndex = zIndex;
      }
      modalDom.tabIndex = 0;
      modalDom.style.display = '';

      this.modalStack.push({ id: id, zIndex: zIndex, modalClass: modalClass });
    },

    closeModal: function closeModal(id) {
      var modalStack = this.modalStack;
      var modalDom = getModal();

      if (modalStack.length > 0) {
        var topItem = modalStack[modalStack.length - 1];
        if (topItem.id === id) {
          if (topItem.modalClass) {
            var classArr = topItem.modalClass.trim().split(/\s+/);
            classArr.forEach(function (item) {
              return (0, dom.removeClass)(modalDom, item);
            });
          }

          modalStack.pop();
          if (modalStack.length > 0) {
            modalDom.style.zIndex = modalStack[modalStack.length - 1].zIndex;
          }
        } else {
          for (var i = modalStack.length - 1; i >= 0; i--) {
            if (modalStack[i].id === id) {
              modalStack.splice(i, 1);
              break;
            }
          }
        }
      }

      if (modalStack.length === 0) {
        if (this.modalFade) {
          (0, dom.addClass)(modalDom, 'v-modal-leave');
        }
        setTimeout(function () {
          if (modalStack.length === 0) {
            if (modalDom.parentNode) modalDom.parentNode.removeChild(modalDom);
            modalDom.style.display = 'none';
            PopupManager.modalDom = undefined;
          }
          (0, dom.removeClass)(modalDom, 'v-modal-leave');
        }, 200);
      }
    }
  };

  Object.defineProperty(PopupManager, 'zIndex', {
    configurable: true,
    get: function get() {
      if (!hasInitZIndex) {
        zIndex = zIndex || (_vue2.default.prototype.$ELEMENT || {}).zIndex || 2000;
        hasInitZIndex = true;
      }
      return zIndex;
    },
    set: function set(value) {
      zIndex = value;
    }
  });

  var getTopPopup = function getTopPopup() {
    if (_vue2.default.prototype.$isServer) return;
    if (PopupManager.modalStack.length > 0) {
      var topPopup = PopupManager.modalStack[PopupManager.modalStack.length - 1];
      if (!topPopup) return;
      var instance = PopupManager.getInstance(topPopup.id);

      return instance;
    }
  };

  if (!_vue2.default.prototype.$isServer) {
    // handle `esc` key when the popup is shown
    window.addEventListener('keydown', function (event) {
      if (event.keyCode === 27) {
        var topPopup = getTopPopup();

        if (topPopup && topPopup.closeOnPressEscape) {
          topPopup.handleClose ? topPopup.handleClose() : topPopup.handleAction ? topPopup.handleAction('cancel') : topPopup.close();
        }
      }
    });
  }

  exports.default = PopupManager;
  });

  unwrapExports(popupManager);

  var scrollbarWidth = createCommonjsModule(function (module, exports) {

  exports.__esModule = true;

  exports.default = function () {
    if (_vue2.default.prototype.$isServer) return 0;
    if (scrollBarWidth !== undefined) return scrollBarWidth;

    var outer = document.createElement('div');
    outer.className = 'el-scrollbar__wrap';
    outer.style.visibility = 'hidden';
    outer.style.width = '100px';
    outer.style.position = 'absolute';
    outer.style.top = '-9999px';
    document.body.appendChild(outer);

    var widthNoScroll = outer.offsetWidth;
    outer.style.overflow = 'scroll';

    var inner = document.createElement('div');
    inner.style.width = '100%';
    outer.appendChild(inner);

    var widthWithScroll = inner.offsetWidth;
    outer.parentNode.removeChild(outer);
    scrollBarWidth = widthNoScroll - widthWithScroll;

    return scrollBarWidth;
  };



  var _vue2 = _interopRequireDefault(vue);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  var scrollBarWidth = void 0;
  });

  unwrapExports(scrollbarWidth);

  var popup = createCommonjsModule(function (module, exports) {

  exports.__esModule = true;
  exports.PopupManager = undefined;



  var _vue2 = _interopRequireDefault(vue);



  var _merge2 = _interopRequireDefault(merge$1);



  var _popupManager2 = _interopRequireDefault(popupManager);



  var _scrollbarWidth2 = _interopRequireDefault(scrollbarWidth);



  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  var idSeed = 1;

  var scrollBarWidth = void 0;

  exports.default = {
    props: {
      visible: {
        type: Boolean,
        default: false
      },
      openDelay: {},
      closeDelay: {},
      zIndex: {},
      modal: {
        type: Boolean,
        default: false
      },
      modalFade: {
        type: Boolean,
        default: true
      },
      modalClass: {},
      modalAppendToBody: {
        type: Boolean,
        default: false
      },
      lockScroll: {
        type: Boolean,
        default: true
      },
      closeOnPressEscape: {
        type: Boolean,
        default: false
      },
      closeOnClickModal: {
        type: Boolean,
        default: false
      }
    },

    beforeMount: function beforeMount() {
      this._popupId = 'popup-' + idSeed++;
      _popupManager2.default.register(this._popupId, this);
    },
    beforeDestroy: function beforeDestroy() {
      _popupManager2.default.deregister(this._popupId);
      _popupManager2.default.closeModal(this._popupId);

      this.restoreBodyStyle();
    },
    data: function data() {
      return {
        opened: false,
        bodyPaddingRight: null,
        computedBodyPaddingRight: 0,
        withoutHiddenClass: true,
        rendered: false
      };
    },


    watch: {
      visible: function visible(val) {
        var _this = this;

        if (val) {
          if (this._opening) return;
          if (!this.rendered) {
            this.rendered = true;
            _vue2.default.nextTick(function () {
              _this.open();
            });
          } else {
            this.open();
          }
        } else {
          this.close();
        }
      }
    },

    methods: {
      open: function open(options) {
        var _this2 = this;

        if (!this.rendered) {
          this.rendered = true;
        }

        var props = (0, _merge2.default)({}, this.$props || this, options);

        if (this._closeTimer) {
          clearTimeout(this._closeTimer);
          this._closeTimer = null;
        }
        clearTimeout(this._openTimer);

        var openDelay = Number(props.openDelay);
        if (openDelay > 0) {
          this._openTimer = setTimeout(function () {
            _this2._openTimer = null;
            _this2.doOpen(props);
          }, openDelay);
        } else {
          this.doOpen(props);
        }
      },
      doOpen: function doOpen(props) {
        if (this.$isServer) return;
        if (this.willOpen && !this.willOpen()) return;
        if (this.opened) return;

        this._opening = true;

        var dom$1 = this.$el;

        var modal = props.modal;

        var zIndex = props.zIndex;
        if (zIndex) {
          _popupManager2.default.zIndex = zIndex;
        }

        if (modal) {
          if (this._closing) {
            _popupManager2.default.closeModal(this._popupId);
            this._closing = false;
          }
          _popupManager2.default.openModal(this._popupId, _popupManager2.default.nextZIndex(), this.modalAppendToBody ? undefined : dom$1, props.modalClass, props.modalFade);
          if (props.lockScroll) {
            this.withoutHiddenClass = !(0, dom.hasClass)(document.body, 'el-popup-parent--hidden');
            if (this.withoutHiddenClass) {
              this.bodyPaddingRight = document.body.style.paddingRight;
              this.computedBodyPaddingRight = parseInt((0, dom.getStyle)(document.body, 'paddingRight'), 10);
            }
            scrollBarWidth = (0, _scrollbarWidth2.default)();
            var bodyHasOverflow = document.documentElement.clientHeight < document.body.scrollHeight;
            var bodyOverflowY = (0, dom.getStyle)(document.body, 'overflowY');
            if (scrollBarWidth > 0 && (bodyHasOverflow || bodyOverflowY === 'scroll') && this.withoutHiddenClass) {
              document.body.style.paddingRight = this.computedBodyPaddingRight + scrollBarWidth + 'px';
            }
            (0, dom.addClass)(document.body, 'el-popup-parent--hidden');
          }
        }

        if (getComputedStyle(dom$1).position === 'static') {
          dom$1.style.position = 'absolute';
        }

        dom$1.style.zIndex = _popupManager2.default.nextZIndex();
        this.opened = true;

        this.onOpen && this.onOpen();

        this.doAfterOpen();
      },
      doAfterOpen: function doAfterOpen() {
        this._opening = false;
      },
      close: function close() {
        var _this3 = this;

        if (this.willClose && !this.willClose()) return;

        if (this._openTimer !== null) {
          clearTimeout(this._openTimer);
          this._openTimer = null;
        }
        clearTimeout(this._closeTimer);

        var closeDelay = Number(this.closeDelay);

        if (closeDelay > 0) {
          this._closeTimer = setTimeout(function () {
            _this3._closeTimer = null;
            _this3.doClose();
          }, closeDelay);
        } else {
          this.doClose();
        }
      },
      doClose: function doClose() {
        this._closing = true;

        this.onClose && this.onClose();

        if (this.lockScroll) {
          setTimeout(this.restoreBodyStyle, 200);
        }

        this.opened = false;

        this.doAfterClose();
      },
      doAfterClose: function doAfterClose() {
        _popupManager2.default.closeModal(this._popupId);
        this._closing = false;
      },
      restoreBodyStyle: function restoreBodyStyle() {
        if (this.modal && this.withoutHiddenClass) {
          document.body.style.paddingRight = this.bodyPaddingRight;
          (0, dom.removeClass)(document.body, 'el-popup-parent--hidden');
        }
        this.withoutHiddenClass = true;
      }
    }
  };
  exports.PopupManager = _popupManager2.default;
  });

  unwrapExports(popup);
  var popup_1 = popup.PopupManager;

  var types = createCommonjsModule(function (module, exports) {

  exports.__esModule = true;
  exports.isString = isString;
  exports.isObject = isObject;
  exports.isHtmlElement = isHtmlElement;
  function isString(obj) {
    return Object.prototype.toString.call(obj) === '[object String]';
  }

  function isObject(obj) {
    return Object.prototype.toString.call(obj) === '[object Object]';
  }

  function isHtmlElement(node) {
    return node && node.nodeType === Node.ELEMENT_NODE;
  }

  var isFunction = exports.isFunction = function isFunction(functionToCheck) {
    var getType = {};
    return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
  };

  var isUndefined = exports.isUndefined = function isUndefined(val) {
    return val === void 0;
  };

  var isDefined = exports.isDefined = function isDefined(val) {
    return val !== undefined && val !== null;
  };
  });

  unwrapExports(types);
  var types_1 = types.isString;
  var types_2 = types.isObject;
  var types_3 = types.isHtmlElement;
  var types_4 = types.isFunction;
  var types_5 = types.isUndefined;
  var types_6 = types.isDefined;

  var util = createCommonjsModule(function (module, exports) {

  exports.__esModule = true;
  exports.isEmpty = exports.isEqual = exports.arrayEquals = exports.looseEqual = exports.capitalize = exports.kebabCase = exports.autoprefixer = exports.isFirefox = exports.isEdge = exports.isIE = exports.coerceTruthyValueToArray = exports.arrayFind = exports.arrayFindIndex = exports.escapeRegexpString = exports.valueEquals = exports.generateId = exports.getValueByPath = undefined;

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

  exports.noop = noop;
  exports.hasOwn = hasOwn;
  exports.toObject = toObject;
  exports.getPropByPath = getPropByPath;
  exports.rafThrottle = rafThrottle;
  exports.objToArray = objToArray;



  var _vue2 = _interopRequireDefault(vue);



  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  var hasOwnProperty = Object.prototype.hasOwnProperty;

  function noop() {}
  function hasOwn(obj, key) {
    return hasOwnProperty.call(obj, key);
  }
  function extend(to, _from) {
    for (var key in _from) {
      to[key] = _from[key];
    }
    return to;
  }
  function toObject(arr) {
    var res = {};
    for (var i = 0; i < arr.length; i++) {
      if (arr[i]) {
        extend(res, arr[i]);
      }
    }
    return res;
  }
  var getValueByPath = exports.getValueByPath = function getValueByPath(object, prop) {
    prop = prop || '';
    var paths = prop.split('.');
    var current = object;
    var result = null;
    for (var i = 0, j = paths.length; i < j; i++) {
      var path = paths[i];
      if (!current) break;

      if (i === j - 1) {
        result = current[path];
        break;
      }
      current = current[path];
    }
    return result;
  };

  function getPropByPath(obj, path, strict) {
    var tempObj = obj;
    path = path.replace(/\[(\w+)\]/g, '.$1');
    path = path.replace(/^\./, '');

    var keyArr = path.split('.');
    var i = 0;
    for (var len = keyArr.length; i < len - 1; ++i) {
      if (!tempObj && !strict) break;
      var key = keyArr[i];
      if (key in tempObj) {
        tempObj = tempObj[key];
      } else {
        if (strict) {
          throw new Error('please transfer a valid prop path to form item!');
        }
        break;
      }
    }
    return {
      o: tempObj,
      k: keyArr[i],
      v: tempObj ? tempObj[keyArr[i]] : null
    };
  }
  var generateId = exports.generateId = function generateId() {
    return Math.floor(Math.random() * 10000);
  };

  var valueEquals = exports.valueEquals = function valueEquals(a, b) {
    // see: https://stackoverflow.com/questions/3115982/how-to-check-if-two-arrays-are-equal-with-javascript
    if (a === b) return true;
    if (!(a instanceof Array)) return false;
    if (!(b instanceof Array)) return false;
    if (a.length !== b.length) return false;
    for (var i = 0; i !== a.length; ++i) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  };

  var escapeRegexpString = exports.escapeRegexpString = function escapeRegexpString() {
    var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    return String(value).replace(/[|\\{}()[\]^$+*?.]/g, '\\$&');
  };

  // TODO: use native Array.find, Array.findIndex when IE support is dropped
  var arrayFindIndex = exports.arrayFindIndex = function arrayFindIndex(arr, pred) {
    for (var i = 0; i !== arr.length; ++i) {
      if (pred(arr[i])) {
        return i;
      }
    }
    return -1;
  };

  var arrayFind = exports.arrayFind = function arrayFind(arr, pred) {
    var idx = arrayFindIndex(arr, pred);
    return idx !== -1 ? arr[idx] : undefined;
  };

  // coerce truthy value to array
  var coerceTruthyValueToArray = exports.coerceTruthyValueToArray = function coerceTruthyValueToArray(val) {
    if (Array.isArray(val)) {
      return val;
    } else if (val) {
      return [val];
    } else {
      return [];
    }
  };

  var isIE = exports.isIE = function isIE() {
    return !_vue2.default.prototype.$isServer && !isNaN(Number(document.documentMode));
  };

  var isEdge = exports.isEdge = function isEdge() {
    return !_vue2.default.prototype.$isServer && navigator.userAgent.indexOf('Edge') > -1;
  };

  var isFirefox = exports.isFirefox = function isFirefox() {
    return !_vue2.default.prototype.$isServer && !!window.navigator.userAgent.match(/firefox/i);
  };

  var autoprefixer = exports.autoprefixer = function autoprefixer(style) {
    if ((typeof style === 'undefined' ? 'undefined' : _typeof(style)) !== 'object') return style;
    var rules = ['transform', 'transition', 'animation'];
    var prefixes = ['ms-', 'webkit-'];
    rules.forEach(function (rule) {
      var value = style[rule];
      if (rule && value) {
        prefixes.forEach(function (prefix) {
          style[prefix + rule] = value;
        });
      }
    });
    return style;
  };

  var kebabCase = exports.kebabCase = function kebabCase(str) {
    var hyphenateRE = /([^-])([A-Z])/g;
    return str.replace(hyphenateRE, '$1-$2').replace(hyphenateRE, '$1-$2').toLowerCase();
  };

  var capitalize = exports.capitalize = function capitalize(str) {
    if (!(0, types.isString)(str)) return str;
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  var looseEqual = exports.looseEqual = function looseEqual(a, b) {
    var isObjectA = (0, types.isObject)(a);
    var isObjectB = (0, types.isObject)(b);
    if (isObjectA && isObjectB) {
      return JSON.stringify(a) === JSON.stringify(b);
    } else if (!isObjectA && !isObjectB) {
      return String(a) === String(b);
    } else {
      return false;
    }
  };

  var arrayEquals = exports.arrayEquals = function arrayEquals(arrayA, arrayB) {
    arrayA = arrayA || [];
    arrayB = arrayB || [];

    if (arrayA.length !== arrayB.length) {
      return false;
    }

    for (var i = 0; i < arrayA.length; i++) {
      if (!looseEqual(arrayA[i], arrayB[i])) {
        return false;
      }
    }

    return true;
  };

  var isEqual = exports.isEqual = function isEqual(value1, value2) {
    if (Array.isArray(value1) && Array.isArray(value2)) {
      return arrayEquals(value1, value2);
    }
    return looseEqual(value1, value2);
  };

  var isEmpty = exports.isEmpty = function isEmpty(val) {
    // null or undefined
    if (val == null) return true;

    if (typeof val === 'boolean') return false;

    if (typeof val === 'number') return !val;

    if (val instanceof Error) return val.message === '';

    switch (Object.prototype.toString.call(val)) {
      // String or Array
      case '[object String]':
      case '[object Array]':
        return !val.length;

      // Map or Set or File
      case '[object File]':
      case '[object Map]':
      case '[object Set]':
        {
          return !val.size;
        }
      // Plain Object
      case '[object Object]':
        {
          return !Object.keys(val).length;
        }
    }

    return false;
  };

  function rafThrottle(fn) {
    var locked = false;
    return function () {
      var _this = this;

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      if (locked) return;
      locked = true;
      window.requestAnimationFrame(function (_) {
        fn.apply(_this, args);
        locked = false;
      });
    };
  }

  function objToArray(obj) {
    if (Array.isArray(obj)) {
      return obj;
    }
    return isEmpty(obj) ? [] : [obj];
  }
  });

  unwrapExports(util);
  var util_1 = util.isEmpty;
  var util_2 = util.isEqual;
  var util_3 = util.arrayEquals;
  var util_4 = util.looseEqual;
  var util_5 = util.capitalize;
  var util_6 = util.kebabCase;
  var util_7 = util.autoprefixer;
  var util_8 = util.isFirefox;
  var util_9 = util.isEdge;
  var util_10 = util.isIE;
  var util_11 = util.coerceTruthyValueToArray;
  var util_12 = util.arrayFind;
  var util_13 = util.arrayFindIndex;
  var util_14 = util.escapeRegexpString;
  var util_15 = util.valueEquals;
  var util_16 = util.generateId;
  var util_17 = util.getValueByPath;
  var util_18 = util.noop;
  var util_19 = util.hasOwn;
  var util_20 = util.toObject;
  var util_21 = util.getPropByPath;
  var util_22 = util.rafThrottle;
  var util_23 = util.objToArray;

  var vdom = createCommonjsModule(function (module, exports) {

  exports.__esModule = true;

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

  exports.isVNode = isVNode;



  function isVNode(node) {
    return node !== null && (typeof node === 'undefined' ? 'undefined' : _typeof(node)) === 'object' && (0, util.hasOwn)(node, 'componentOptions');
  }});

  unwrapExports(vdom);
  var vdom_1 = vdom.isVNode;

  var message = createCommonjsModule(function (module) {
  module.exports =
  /******/ (function(modules) { // webpackBootstrap
  /******/ 	// The module cache
  /******/ 	var installedModules = {};
  /******/
  /******/ 	// The require function
  /******/ 	function __webpack_require__(moduleId) {
  /******/
  /******/ 		// Check if module is in cache
  /******/ 		if(installedModules[moduleId]) {
  /******/ 			return installedModules[moduleId].exports;
  /******/ 		}
  /******/ 		// Create a new module (and put it into the cache)
  /******/ 		var module = installedModules[moduleId] = {
  /******/ 			i: moduleId,
  /******/ 			l: false,
  /******/ 			exports: {}
  /******/ 		};
  /******/
  /******/ 		// Execute the module function
  /******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
  /******/
  /******/ 		// Flag the module as loaded
  /******/ 		module.l = true;
  /******/
  /******/ 		// Return the exports of the module
  /******/ 		return module.exports;
  /******/ 	}
  /******/
  /******/
  /******/ 	// expose the modules object (__webpack_modules__)
  /******/ 	__webpack_require__.m = modules;
  /******/
  /******/ 	// expose the module cache
  /******/ 	__webpack_require__.c = installedModules;
  /******/
  /******/ 	// define getter function for harmony exports
  /******/ 	__webpack_require__.d = function(exports, name, getter) {
  /******/ 		if(!__webpack_require__.o(exports, name)) {
  /******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
  /******/ 		}
  /******/ 	};
  /******/
  /******/ 	// define __esModule on exports
  /******/ 	__webpack_require__.r = function(exports) {
  /******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
  /******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
  /******/ 		}
  /******/ 		Object.defineProperty(exports, '__esModule', { value: true });
  /******/ 	};
  /******/
  /******/ 	// create a fake namespace object
  /******/ 	// mode & 1: value is a module id, require it
  /******/ 	// mode & 2: merge all properties of value into the ns
  /******/ 	// mode & 4: return value when already ns object
  /******/ 	// mode & 8|1: behave like require
  /******/ 	__webpack_require__.t = function(value, mode) {
  /******/ 		if(mode & 1) value = __webpack_require__(value);
  /******/ 		if(mode & 8) return value;
  /******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
  /******/ 		var ns = Object.create(null);
  /******/ 		__webpack_require__.r(ns);
  /******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
  /******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
  /******/ 		return ns;
  /******/ 	};
  /******/
  /******/ 	// getDefaultExport function for compatibility with non-harmony modules
  /******/ 	__webpack_require__.n = function(module) {
  /******/ 		var getter = module && module.__esModule ?
  /******/ 			function getDefault() { return module['default']; } :
  /******/ 			function getModuleExports() { return module; };
  /******/ 		__webpack_require__.d(getter, 'a', getter);
  /******/ 		return getter;
  /******/ 	};
  /******/
  /******/ 	// Object.prototype.hasOwnProperty.call
  /******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
  /******/
  /******/ 	// __webpack_public_path__
  /******/ 	__webpack_require__.p = "/dist/";
  /******/
  /******/
  /******/ 	// Load entry module and return exports
  /******/ 	return __webpack_require__(__webpack_require__.s = 73);
  /******/ })
  /************************************************************************/
  /******/ ({

  /***/ 0:
  /***/ (function(module, __webpack_exports__, __webpack_require__) {
  /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return normalizeComponent; });
  /* globals __VUE_SSR_CONTEXT__ */

  // IMPORTANT: Do NOT use ES2015 features in this file (except for modules).
  // This module is a runtime utility for cleaner component module output and will
  // be included in the final webpack user bundle.

  function normalizeComponent (
    scriptExports,
    render,
    staticRenderFns,
    functionalTemplate,
    injectStyles,
    scopeId,
    moduleIdentifier, /* server only */
    shadowMode /* vue-cli only */
  ) {
    // Vue.extend constructor export interop
    var options = typeof scriptExports === 'function'
      ? scriptExports.options
      : scriptExports;

    // render functions
    if (render) {
      options.render = render;
      options.staticRenderFns = staticRenderFns;
      options._compiled = true;
    }

    // functional template
    if (functionalTemplate) {
      options.functional = true;
    }

    // scopedId
    if (scopeId) {
      options._scopeId = 'data-v-' + scopeId;
    }

    var hook;
    if (moduleIdentifier) { // server build
      hook = function (context) {
        // 2.3 injection
        context =
          context || // cached call
          (this.$vnode && this.$vnode.ssrContext) || // stateful
          (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext); // functional
        // 2.2 with runInNewContext: true
        if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
          context = __VUE_SSR_CONTEXT__;
        }
        // inject component styles
        if (injectStyles) {
          injectStyles.call(this, context);
        }
        // register component module identifier for async chunk inferrence
        if (context && context._registeredComponents) {
          context._registeredComponents.add(moduleIdentifier);
        }
      };
      // used by ssr in case component is cached and beforeCreate
      // never gets called
      options._ssrRegister = hook;
    } else if (injectStyles) {
      hook = shadowMode
        ? function () { injectStyles.call(this, this.$root.$options.shadowRoot); }
        : injectStyles;
    }

    if (hook) {
      if (options.functional) {
        // for template-only hot-reload because in that case the render fn doesn't
        // go through the normalizer
        options._injectStyles = hook;
        // register for functioal component in vue file
        var originalRender = options.render;
        options.render = function renderWithStyleInjection (h, context) {
          hook.call(context);
          return originalRender(h, context)
        };
      } else {
        // inject component registration as beforeCreate hook
        var existing = options.beforeCreate;
        options.beforeCreate = existing
          ? [].concat(existing, hook)
          : [hook];
      }
    }

    return {
      exports: scriptExports,
      options: options
    }
  }


  /***/ }),

  /***/ 14:
  /***/ (function(module, exports) {

  module.exports = popup;

  /***/ }),

  /***/ 23:
  /***/ (function(module, exports) {

  module.exports = vdom;

  /***/ }),

  /***/ 7:
  /***/ (function(module, exports) {

  module.exports = vue;

  /***/ }),

  /***/ 73:
  /***/ (function(module, __webpack_exports__, __webpack_require__) {
  __webpack_require__.r(__webpack_exports__);

  // EXTERNAL MODULE: external "vue"
  var external_vue_ = __webpack_require__(7);
  var external_vue_default = /*#__PURE__*/__webpack_require__.n(external_vue_);

  // CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./packages/message/src/main.vue?vue&type=template&id=455b9f60&
  var render = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c(
      "transition",
      {
        attrs: { name: "el-message-fade" },
        on: { "after-leave": _vm.handleAfterLeave }
      },
      [
        _c(
          "div",
          {
            directives: [
              {
                name: "show",
                rawName: "v-show",
                value: _vm.visible,
                expression: "visible"
              }
            ],
            class: [
              "el-message",
              _vm.type && !_vm.iconClass ? "el-message--" + _vm.type : "",
              _vm.center ? "is-center" : "",
              _vm.showClose ? "is-closable" : "",
              _vm.customClass
            ],
            style: _vm.positionStyle,
            attrs: { role: "alert" },
            on: { mouseenter: _vm.clearTimer, mouseleave: _vm.startTimer }
          },
          [
            _vm.iconClass
              ? _c("i", { class: _vm.iconClass })
              : _c("i", { class: _vm.typeClass }),
            _vm._t("default", [
              !_vm.dangerouslyUseHTMLString
                ? _c("p", { staticClass: "el-message__content" }, [
                    _vm._v(_vm._s(_vm.message))
                  ])
                : _c("p", {
                    staticClass: "el-message__content",
                    domProps: { innerHTML: _vm._s(_vm.message) }
                  })
            ]),
            _vm.showClose
              ? _c("i", {
                  staticClass: "el-message__closeBtn el-icon-close",
                  on: { click: _vm.close }
                })
              : _vm._e()
          ],
          2
        )
      ]
    )
  };
  var staticRenderFns = [];
  render._withStripped = true;


  // CONCATENATED MODULE: ./packages/message/src/main.vue?vue&type=template&id=455b9f60&

  // CONCATENATED MODULE: ./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./packages/message/src/main.vue?vue&type=script&lang=js&
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //

  var typeMap = {
    success: 'success',
    info: 'info',
    warning: 'warning',
    error: 'error'
  };

  /* harmony default export */ var mainvue_type_script_lang_js_ = ({
    data: function data() {
      return {
        visible: false,
        message: '',
        duration: 3000,
        type: 'info',
        iconClass: '',
        customClass: '',
        onClose: null,
        showClose: false,
        closed: false,
        verticalOffset: 20,
        timer: null,
        dangerouslyUseHTMLString: false,
        center: false
      };
    },


    computed: {
      typeClass: function typeClass() {
        return this.type && !this.iconClass ? 'el-message__icon el-icon-' + typeMap[this.type] : '';
      },
      positionStyle: function positionStyle() {
        return {
          'top': this.verticalOffset + 'px'
        };
      }
    },

    watch: {
      closed: function closed(newVal) {
        if (newVal) {
          this.visible = false;
        }
      }
    },

    methods: {
      handleAfterLeave: function handleAfterLeave() {
        this.$destroy(true);
        this.$el.parentNode.removeChild(this.$el);
      },
      close: function close() {
        this.closed = true;
        if (typeof this.onClose === 'function') {
          this.onClose(this);
        }
      },
      clearTimer: function clearTimer() {
        clearTimeout(this.timer);
      },
      startTimer: function startTimer() {
        var _this = this;

        if (this.duration > 0) {
          this.timer = setTimeout(function () {
            if (!_this.closed) {
              _this.close();
            }
          }, this.duration);
        }
      },
      keydown: function keydown(e) {
        if (e.keyCode === 27) {
          // esc关闭消息
          if (!this.closed) {
            this.close();
          }
        }
      }
    },
    mounted: function mounted() {
      this.startTimer();
      document.addEventListener('keydown', this.keydown);
    },
    beforeDestroy: function beforeDestroy() {
      document.removeEventListener('keydown', this.keydown);
    }
  });
  // CONCATENATED MODULE: ./packages/message/src/main.vue?vue&type=script&lang=js&
   /* harmony default export */ var src_mainvue_type_script_lang_js_ = (mainvue_type_script_lang_js_); 
  // EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
  var componentNormalizer = __webpack_require__(0);

  // CONCATENATED MODULE: ./packages/message/src/main.vue





  /* normalize component */

  var component = Object(componentNormalizer["a" /* default */])(
    src_mainvue_type_script_lang_js_,
    render,
    staticRenderFns,
    false,
    null,
    null,
    null
    
  );
  component.options.__file = "packages/message/src/main.vue";
  /* harmony default export */ var main = (component.exports);
  // EXTERNAL MODULE: external "element-ui/lib/utils/popup"
  var popup_ = __webpack_require__(14);

  // EXTERNAL MODULE: external "element-ui/lib/utils/vdom"
  var vdom_ = __webpack_require__(23);

  // CONCATENATED MODULE: ./packages/message/src/main.js




  var MessageConstructor = external_vue_default.a.extend(main);

  var instance = void 0;
  var instances = [];
  var seed = 1;

  var main_Message = function Message(options) {
    if (external_vue_default.a.prototype.$isServer) return;
    options = options || {};
    if (typeof options === 'string') {
      options = {
        message: options
      };
    }
    var userOnClose = options.onClose;
    var id = 'message_' + seed++;

    options.onClose = function () {
      Message.close(id, userOnClose);
    };
    instance = new MessageConstructor({
      data: options
    });
    instance.id = id;
    if (Object(vdom_["isVNode"])(instance.message)) {
      instance.$slots.default = [instance.message];
      instance.message = null;
    }
    instance.$mount();
    document.body.appendChild(instance.$el);
    var verticalOffset = options.offset || 20;
    instances.forEach(function (item) {
      verticalOffset += item.$el.offsetHeight + 16;
    });
    instance.verticalOffset = verticalOffset;
    instance.visible = true;
    instance.$el.style.zIndex = popup_["PopupManager"].nextZIndex();
    instances.push(instance);
    return instance;
  };

  ['success', 'warning', 'info', 'error'].forEach(function (type) {
    main_Message[type] = function (options) {
      if (typeof options === 'string') {
        options = {
          message: options
        };
      }
      options.type = type;
      return main_Message(options);
    };
  });

  main_Message.close = function (id, userOnClose) {
    var len = instances.length;
    var index = -1;
    for (var i = 0; i < len; i++) {
      if (id === instances[i].id) {
        index = i;
        if (typeof userOnClose === 'function') {
          userOnClose(instances[i]);
        }
        instances.splice(i, 1);
        break;
      }
    }
    if (len <= 1 || index === -1 || index > instances.length - 1) return;
    var removedHeight = instances[index].$el.offsetHeight;
    for (var _i = index; _i < len - 1; _i++) {
      var dom = instances[_i].$el;
      dom.style['top'] = parseInt(dom.style['top'], 10) - removedHeight - 16 + 'px';
    }
  };

  main_Message.closeAll = function () {
    for (var i = instances.length - 1; i >= 0; i--) {
      instances[i].close();
    }
  };

  /* harmony default export */ var src_main = (main_Message);
  // CONCATENATED MODULE: ./packages/message/index.js

  /* harmony default export */ var message = __webpack_exports__["default"] = (src_main);

  /***/ })

  /******/ });
  });

  var Message = unwrapExports(message);

  const isPro = process.env.NODE_ENV === 'production';
  const { CancelToken: CancelToken$1 } = axios$1;
  const DEFAULTOPTION = { // 默认选项
    method: 'post',
    warning: true,
    login: true
  };

  class Request {
    constructor (config) {
      const baseURL = config[isPro ? 'proBaseUrl': 'devBaseUrl'] || '';
      this.service = axios$1.create({
        baseURL: baseURL,
        timeout: 100000
      });
      // 添加请求拦截
      Request.requestInterceptor(this.service);
      // 添加返回拦截
      Request.responseInterceptor(this.service);
    }

    // 设置请求头参数
    static getCookies() {
      return {
        Authorization: js_cookie.get('BEARER_TOKEN'),
        'W-FLOW': js_cookie.get('W-FLOW') || 'default',
        'W-SEQ': js_cookie.get('W-SEQ') || '1569595974015_2',
        ip: js_cookie.get('ip') || 'http://127.0.0.1'
      }
    }
    static getMessage(code, str) {
      if (!str) return 0
      const matchStr = str.split(`${code}:`);
      const re = /[\u4e00-\u9fa5]+/;
      const message = matchStr[matchStr.length - 1];
    
      return re.test(message) ? message : 0
    }

    static requestInterceptor (service) {
      // 添加 token
      service.interceptors.request.use((conf) => {
        const {
          data, checkFn, source, refixFn
        } = conf;
        if (data && refixFn) {
          conf.data = refixFn(data);
        }
        if (data && checkFn) {
          const message = checkFn(data);
          if (message) {
            source.cancel(message);
          }
        }
        // 添加系统参数
        conf.headers.common = Object.assign(conf.headers.common, Request.getCookies());
        return conf
      });
    }

    static responseInterceptor (service) {
      service.interceptors.response.use(res => res.data, (err) => {
        Message({
          message: err.message || (`请求失败, 服务端无响应${err}`),
          type: err.message ? 'warning' : 'error',
          duration: 4500
        });
        return Promise.reject(err)
      });
    }

    static handle (data, conf) {
      // 处理提交数据
      if (conf.refixFn) {
        data.refixFn = conf.refixFn;
      }
      // 处理是否取消请求
      if (conf.checkFn) {
        const source = CancelToken$1.source();
        data.checkFn = conf.checkFn;
        data.cancelToken = source.token;
        data.source = source;
      }
      // loading 状态
      const setLoadingState = (bool) => {
        if (conf.loading && this[conf.loading] !== undefined) {
          this[conf.loading] = bool;
        }
      };
      setLoadingState(true);
      return this.service(data).then((res) => {
        setLoadingState(false);
        if (res.success && conf.successTxt) {
          Message({
            message: conf.successTxt,
            type: 'success',
            duration: conf.duration || 4500
          });
        }
        if (!res.success && conf.warning) {
          const { code, message } = res.errorDetail;
          const tipTxt = (conf.failTxt || '') + (Request.getMessage(code, message) || '');
          if (tipTxt && tipTxt !== 'undefined') {
            Message({
              message: tipTxt,
              type: 'error',
              duration: conf.duration || 4500
            });
          }
        }
        return res
      }).catch((err) => {
        setLoadingState(false);
        return Promise.reject(err)
      })
    }

    temp (url, conf = {}) {
      return function factory (data, customer) {
        const newConf = Object.assign({}, DEFAULTOPTION, conf, customer);
        const _data = {
          url,
          method: newConf.method,
          [newConf.method === 'post' ? 'data' : 'params']: data || {}
        };
        const handle = this ? Request.handle.bind(this) : Request.handle;
        return handle(_data, newConf)
      }
    }
  }

  exports.Request = Request;
  exports.default = Request;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
