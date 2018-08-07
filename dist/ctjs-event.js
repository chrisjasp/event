(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["ctjs-event"] = factory();
	else
		root["ctjs-event"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
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
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
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
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EventHub = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _v = __webpack_require__(1);

var _v2 = _interopRequireDefault(_v);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// eslint-disable-line no-loop-func

var EventHub = exports.EventHub = function () {
  function EventHub() {
    _classCallCheck(this, EventHub);

    this.subscriptions = {};
    Object.freeze(this);
  }

  _createClass(EventHub, [{
    key: 'subscribe',
    value: function subscribe(key, channel, func) {
      var keyValue = void 0;

      if (typeof key === 'function') {
        keyValue = key.name;
      } else if (typeof key === 'string') {
        keyValue = key;
      } else {
        throw new Error('Subscribe Key must be valid string or function');
      }

      var keySubscribers = this.subscriptions[keyValue] || (this.subscriptions[keyValue] = []);

      var result = void 0;
      var handler = void 0;
      if (Array.isArray(channel)) {
        var ra = [];
        var aa = function aa(h, k) {
          var idx = k.indexOf(h);
          if (idx !== -1) {
            k.splice(idx, 1);
          }
        };

        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = channel[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var c = _step.value;

            handler = new Handler(c, func);
            // Check if this handler is registered already
            var subIndex = keySubscribers.findIndex(function (p) {
              return p.messageType === handler.messageType;
            });
            if (subIndex === -1) {
              keySubscribers.push(handler);
            } else {
              keySubscribers[subIndex] = handler;
            }
            ra.push({
              dispose: aa.bind(this, handler, keySubscribers)
            });
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }

        result = ra;
      } else if (typeof channel === 'string') {
        handler = new Handler(channel, func);
        // Check if this handler is registered already
        var _subIndex = keySubscribers.findIndex(function (p) {
          return p.messageType === handler.messageType;
        });
        if (_subIndex === -1) {
          keySubscribers.push(handler);
        } else {
          keySubscribers[_subIndex] = handler;
        }

        result = {
          dispose: function dispose() {
            var idx = keySubscribers.indexOf(handler);
            if (idx !== -1) {
              keySubscribers.splice(idx, 1);
            }
          }
        };
      } else {
        throw new Error('Subscribe Key must be valid string or function');
      }
      return result;
    }
  }, {
    key: 'subscribeOnce',
    value: function subscribeOnce(key, channel, func) {
      var _this = this;

      if (typeof channel === 'string') {
        var s = this.subscribe(key, channel, function (a, b) {
          if (!s && !s.dispose) {
            return;
          }
          s.dispose();
          return func(a, b);
        });
        return s;
      } else if (Array.isArray(channel)) {
        var result = [];

        var _loop = function _loop(c) {
          var s = _this.subscribe(key, c, function (a, b) {
            if (!s && !s.dispose) {
              return;
            }
            s.dispose();
            return func(a, b);
          });
          result.push(s);
        };

        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = channel[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var c = _step2.value;

            _loop(c);
          }
        } catch (err) {
          _didIteratorError2 = true;
          _iteratorError2 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion2 && _iterator2.return) {
              _iterator2.return();
            }
          } finally {
            if (_didIteratorError2) {
              throw _iteratorError2;
            }
          }
        }

        return result;
      }
    }
  }, {
    key: 'publish',
    value: function publish(channel, payload) {
      if (typeof channel === 'string') {
        var _iteratorNormalCompletion3 = true;
        var _didIteratorError3 = false;
        var _iteratorError3 = undefined;

        try {
          for (var _iterator3 = Object.keys(this.subscriptions)[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
            var keys = _step3.value;

            this.subscriptions[keys].find(function (k) {
              // eslint-disable-line
              if (!k) {
                return;
              }
              if (k.messageType === channel) {
                k.handle(payload);
              }
            });
          }
        } catch (err) {
          _didIteratorError3 = true;
          _iteratorError3 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion3 && _iterator3.return) {
              _iterator3.return();
            }
          } finally {
            if (_didIteratorError3) {
              throw _iteratorError3;
            }
          }
        }
      }
    }
  }, {
    key: 'unsubscribe',
    value: function unsubscribe(key) {
      var keyValue = void 0;
      if (typeof key === 'function') {
        keyValue = key.name;
      } else if (typeof key === 'string') {
        keyValue = key;
      } else {
        throw new Error('Subscribe Key must be valid string or function');
      }
      delete this.subscriptions[keyValue];
    }
  }, {
    key: 'attachEventHub',
    value: function attachEventHub(obj, keyName) {
      var eventHub = this;
      var k = keyName != null ? keyName : (0, _v2.default)();

      obj.subscribe = function (channel, callback) {
        return eventHub.subscribe(k, channel, callback);
      };

      obj.subscribeOnce = function (channel, callback) {
        return eventHub.subscribeOnce(k, channel, callback);
      };

      obj.publish = function (channel, data) {
        eventHub.publish(channel, data);
      };

      obj.unsubscribe = function () {
        eventHub.unsubscribe(k);
      };
    }
  }]);

  return EventHub;
}();

var Handler = function () {
  function Handler(messageType, callback) {
    _classCallCheck(this, Handler);

    this.messageType = messageType;
    this.callback = callback;
  }

  _createClass(Handler, [{
    key: 'handle',
    value: function handle(message) {
      this.callback.call(null, message);
    }
  }]);

  return Handler;
}();

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

var rng = __webpack_require__(2);
var bytesToUuid = __webpack_require__(4);

function v4(options, buf, offset) {
  var i = buf && offset || 0;

  if (typeof(options) == 'string') {
    buf = options == 'binary' ? new Array(16) : null;
    options = null;
  }
  options = options || {};

  var rnds = options.random || (options.rng || rng)();

  // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`
  rnds[6] = (rnds[6] & 0x0f) | 0x40;
  rnds[8] = (rnds[8] & 0x3f) | 0x80;

  // Copy bytes to buffer, if provided
  if (buf) {
    for (var ii = 0; ii < 16; ++ii) {
      buf[i + ii] = rnds[ii];
    }
  }

  return buf || bytesToUuid(rnds);
}

module.exports = v4;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {// Unique ID creation requires a high quality random # generator.  In the
// browser this is a little complicated due to unknown quality of Math.random()
// and inconsistent support for the `crypto` API.  We do the best we can via
// feature-detection
var rng;

var crypto = global.crypto || global.msCrypto; // for IE 11
if (crypto && crypto.getRandomValues) {
  // WHATWG crypto RNG - http://wiki.whatwg.org/wiki/Crypto
  var rnds8 = new Uint8Array(16); // eslint-disable-line no-undef
  rng = function whatwgRNG() {
    crypto.getRandomValues(rnds8);
    return rnds8;
  };
}

if (!rng) {
  // Math.random()-based (RNG)
  //
  // If all else fails, use Math.random().  It's fast, but is of unspecified
  // quality.
  var rnds = new Array(16);
  rng = function() {
    for (var i = 0, r; i < 16; i++) {
      if ((i & 0x03) === 0) r = Math.random() * 0x100000000;
      rnds[i] = r >>> ((i & 0x03) << 3) & 0xff;
    }

    return rnds;
  };
}

module.exports = rng;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ }),
/* 3 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 4 */
/***/ (function(module, exports) {

/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */
var byteToHex = [];
for (var i = 0; i < 256; ++i) {
  byteToHex[i] = (i + 0x100).toString(16).substr(1);
}

function bytesToUuid(buf, offset) {
  var i = offset || 0;
  var bth = byteToHex;
  return bth[buf[i++]] + bth[buf[i++]] +
          bth[buf[i++]] + bth[buf[i++]] + '-' +
          bth[buf[i++]] + bth[buf[i++]] + '-' +
          bth[buf[i++]] + bth[buf[i++]] + '-' +
          bth[buf[i++]] + bth[buf[i++]] + '-' +
          bth[buf[i++]] + bth[buf[i++]] +
          bth[buf[i++]] + bth[buf[i++]] +
          bth[buf[i++]] + bth[buf[i++]];
}

module.exports = bytesToUuid;


/***/ })
/******/ ]);
});