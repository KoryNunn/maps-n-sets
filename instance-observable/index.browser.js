(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/home/kory/dev/weakmapsarefuckingamazing/instance-observable/clear.js":[function(require,module,exports){
var observable = require('./observable'),
    crel = require('crel');

module.exports = function(data){
    var button = crel('button', 'Clear');

    button.addEventListener('click', function(event){
        observable.set(data, 'things', '');
    });

    return button;
};
},{"./observable":"/home/kory/dev/weakmapsarefuckingamazing/instance-observable/observable.js","crel":"/home/kory/dev/weakmapsarefuckingamazing/instance-observable/node_modules/crel/crel.js"}],"/home/kory/dev/weakmapsarefuckingamazing/instance-observable/index.js":[function(require,module,exports){
var observable = require('./observable'),
    crel = require('crel');

function makeThing(){
    var data = {},
        input,
        clear,
        label;

    crel(document.body,
        input = require('./input')(data),
        clear = require('./clear')(data),
        label = require('./label')(data)
    );

    setTimeout(function(){
        input.remove();
        clear.remove();
        label.remove();
        data = input = clear = label = null;
    }, 1000);
}

window.onload = function(){

    setInterval(function(){
        for(var i = 0; i < 100; i++){
            makeThing();
        }
    },1000);
};
},{"./clear":"/home/kory/dev/weakmapsarefuckingamazing/instance-observable/clear.js","./input":"/home/kory/dev/weakmapsarefuckingamazing/instance-observable/input.js","./label":"/home/kory/dev/weakmapsarefuckingamazing/instance-observable/label.js","./observable":"/home/kory/dev/weakmapsarefuckingamazing/instance-observable/observable.js","crel":"/home/kory/dev/weakmapsarefuckingamazing/instance-observable/node_modules/crel/crel.js"}],"/home/kory/dev/weakmapsarefuckingamazing/instance-observable/input.js":[function(require,module,exports){
var observable = require('./observable'),
    crel = require('crel');

module.exports = function(data){
    var input = crel('input');

    input.addEventListener('keyup', function(event){
        observable.set(data, 'things', event.target.value);
    });

    observable.on(data, 'things', function(value){
        if(input.value === value){
            return;
        }

        input.value = value;
    });

    return input;
};
},{"./observable":"/home/kory/dev/weakmapsarefuckingamazing/instance-observable/observable.js","crel":"/home/kory/dev/weakmapsarefuckingamazing/instance-observable/node_modules/crel/crel.js"}],"/home/kory/dev/weakmapsarefuckingamazing/instance-observable/label.js":[function(require,module,exports){
var observable = require('./observable'),
    crel = require('crel');

module.exports = function(data){
    var label = crel('label');

    observable.on(data, 'things', function(value){
        label.textContent = value;
    });

    return label;
};
},{"./observable":"/home/kory/dev/weakmapsarefuckingamazing/instance-observable/observable.js","crel":"/home/kory/dev/weakmapsarefuckingamazing/instance-observable/node_modules/crel/crel.js"}],"/home/kory/dev/weakmapsarefuckingamazing/instance-observable/node_modules/crel/crel.js":[function(require,module,exports){
//Copyright (C) 2012 Kory Nunn

//Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

//The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

//THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

/*

    This code is not formatted for readability, but rather run-speed and to assist compilers.

    However, the code's intention should be transparent.

    *** IE SUPPORT ***

    If you require this library to work in IE7, add the following after declaring crel.

    var testDiv = document.createElement('div'),
        testLabel = document.createElement('label');

    testDiv.setAttribute('class', 'a');
    testDiv['className'] !== 'a' ? crel.attrMap['class'] = 'className':undefined;
    testDiv.setAttribute('name','a');
    testDiv['name'] !== 'a' ? crel.attrMap['name'] = function(element, value){
        element.id = value;
    }:undefined;


    testLabel.setAttribute('for', 'a');
    testLabel['htmlFor'] !== 'a' ? crel.attrMap['for'] = 'htmlFor':undefined;



*/

(function (root, factory) {
    if (typeof exports === 'object') {
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        define(factory);
    } else {
        root.crel = factory();
    }
}(this, function () {
    var fn = 'function',
        obj = 'object',
        nodeType = 'nodeType',
        textContent = 'textContent',
        setAttribute = 'setAttribute',
        attrMapString = 'attrMap',
        isNodeString = 'isNode',
        isElementString = 'isElement',
        d = typeof document === obj ? document : {},
        isType = function(a, type){
            return typeof a === type;
        },
        isNode = typeof Node === fn ? function (object) {
            return object instanceof Node;
        } :
        // in IE <= 8 Node is an object, obviously..
        function(object){
            return object &&
                isType(object, obj) &&
                (nodeType in object) &&
                isType(object.ownerDocument,obj);
        },
        isElement = function (object) {
            return crel[isNodeString](object) && object[nodeType] === 1;
        },
        isArray = function(a){
            return a instanceof Array;
        },
        appendChild = function(element, child) {
          if(!crel[isNodeString](child)){
              child = d.createTextNode(child);
          }
          element.appendChild(child);
        };


    function crel(){
        var args = arguments, //Note: assigned to a variable to assist compilers. Saves about 40 bytes in closure compiler. Has negligable effect on performance.
            element = args[0],
            child,
            settings = args[1],
            childIndex = 2,
            argumentsLength = args.length,
            attributeMap = crel[attrMapString];

        element = crel[isElementString](element) ? element : d.createElement(element);
        // shortcut
        if(argumentsLength === 1){
            return element;
        }

        if(!isType(settings,obj) || crel[isNodeString](settings) || isArray(settings)) {
            --childIndex;
            settings = null;
        }

        // shortcut if there is only one child that is a string
        if((argumentsLength - childIndex) === 1 && isType(args[childIndex], 'string') && element[textContent] !== undefined){
            element[textContent] = args[childIndex];
        }else{
            for(; childIndex < argumentsLength; ++childIndex){
                child = args[childIndex];

                if(child == null){
                    continue;
                }

                if (isArray(child)) {
                  for (var i=0; i < child.length; ++i) {
                    appendChild(element, child[i]);
                  }
                } else {
                  appendChild(element, child);
                }
            }
        }

        for(var key in settings){
            if(!attributeMap[key]){
                element[setAttribute](key, settings[key]);
            }else{
                var attr = attributeMap[key];
                if(typeof attr === fn){
                    attr(element, settings[key]);
                }else{
                    element[setAttribute](attr, settings[key]);
                }
            }
        }

        return element;
    }

    // Used for mapping one kind of attribute to the supported version of that in bad browsers.
    crel[attrMapString] = {};

    crel[isElementString] = isElement;

    crel[isNodeString] = isNode;

    return crel;
}));

},{}],"/home/kory/dev/weakmapsarefuckingamazing/instance-observable/node_modules/es6-weak-map/index.js":[function(require,module,exports){
'use strict';

module.exports = require('./is-implemented')() ? WeakMap : require('./polyfill');

},{"./is-implemented":"/home/kory/dev/weakmapsarefuckingamazing/instance-observable/node_modules/es6-weak-map/is-implemented.js","./polyfill":"/home/kory/dev/weakmapsarefuckingamazing/instance-observable/node_modules/es6-weak-map/polyfill.js"}],"/home/kory/dev/weakmapsarefuckingamazing/instance-observable/node_modules/es6-weak-map/is-implemented.js":[function(require,module,exports){
'use strict';

module.exports = function () {
	var weakMap, x;
	if (typeof WeakMap !== 'function') return false;
	if (String(WeakMap.prototype) !== '[object WeakMap]') return false;
	try {
		// WebKit doesn't support arguments and crashes
		weakMap = new WeakMap([[x = {}, 'one'], [{}, 'two'], [{}, 'three']]);
	} catch (e) {
		return false;
	}
	if (typeof weakMap.set !== 'function') return false;
	if (weakMap.set({}, 1) !== weakMap) return false;
	if (typeof weakMap.delete !== 'function') return false;
	if (typeof weakMap.has !== 'function') return false;
	if (weakMap.get(x) !== 'one') return false;

	return true;
};

},{}],"/home/kory/dev/weakmapsarefuckingamazing/instance-observable/node_modules/es6-weak-map/is-native-implemented.js":[function(require,module,exports){
// Exports true if environment provides native `WeakMap` implementation, whatever that is.

'use strict';

module.exports = (function () {
	if (typeof WeakMap !== 'function') return false;
	return (Object.prototype.toString.call(new WeakMap()) === '[object WeakMap]');
}());

},{}],"/home/kory/dev/weakmapsarefuckingamazing/instance-observable/node_modules/es6-weak-map/node_modules/d/auto-bind.js":[function(require,module,exports){
'use strict';

var copy       = require('es5-ext/object/copy')
  , map        = require('es5-ext/object/map')
  , callable   = require('es5-ext/object/valid-callable')
  , validValue = require('es5-ext/object/valid-value')

  , bind = Function.prototype.bind, defineProperty = Object.defineProperty
  , hasOwnProperty = Object.prototype.hasOwnProperty
  , define;

define = function (name, desc, bindTo) {
	var value = validValue(desc) && callable(desc.value), dgs;
	dgs = copy(desc);
	delete dgs.writable;
	delete dgs.value;
	dgs.get = function () {
		if (hasOwnProperty.call(this, name)) return value;
		desc.value = bind.call(value, (bindTo == null) ? this : this[bindTo]);
		defineProperty(this, name, desc);
		return this[name];
	};
	return dgs;
};

module.exports = function (props/*, bindTo*/) {
	var bindTo = arguments[1];
	return map(props, function (desc, name) {
		return define(name, desc, bindTo);
	});
};

},{"es5-ext/object/copy":"/home/kory/dev/weakmapsarefuckingamazing/instance-observable/node_modules/es6-weak-map/node_modules/es5-ext/object/copy.js","es5-ext/object/map":"/home/kory/dev/weakmapsarefuckingamazing/instance-observable/node_modules/es6-weak-map/node_modules/es5-ext/object/map.js","es5-ext/object/valid-callable":"/home/kory/dev/weakmapsarefuckingamazing/instance-observable/node_modules/es6-weak-map/node_modules/es5-ext/object/valid-callable.js","es5-ext/object/valid-value":"/home/kory/dev/weakmapsarefuckingamazing/instance-observable/node_modules/es6-weak-map/node_modules/es5-ext/object/valid-value.js"}],"/home/kory/dev/weakmapsarefuckingamazing/instance-observable/node_modules/es6-weak-map/node_modules/d/index.js":[function(require,module,exports){
'use strict';

var assign        = require('es5-ext/object/assign')
  , normalizeOpts = require('es5-ext/object/normalize-options')
  , isCallable    = require('es5-ext/object/is-callable')
  , contains      = require('es5-ext/string/#/contains')

  , d;

d = module.exports = function (dscr, value/*, options*/) {
	var c, e, w, options, desc;
	if ((arguments.length < 2) || (typeof dscr !== 'string')) {
		options = value;
		value = dscr;
		dscr = null;
	} else {
		options = arguments[2];
	}
	if (dscr == null) {
		c = w = true;
		e = false;
	} else {
		c = contains.call(dscr, 'c');
		e = contains.call(dscr, 'e');
		w = contains.call(dscr, 'w');
	}

	desc = { value: value, configurable: c, enumerable: e, writable: w };
	return !options ? desc : assign(normalizeOpts(options), desc);
};

d.gs = function (dscr, get, set/*, options*/) {
	var c, e, options, desc;
	if (typeof dscr !== 'string') {
		options = set;
		set = get;
		get = dscr;
		dscr = null;
	} else {
		options = arguments[3];
	}
	if (get == null) {
		get = undefined;
	} else if (!isCallable(get)) {
		options = get;
		get = set = undefined;
	} else if (set == null) {
		set = undefined;
	} else if (!isCallable(set)) {
		options = set;
		set = undefined;
	}
	if (dscr == null) {
		c = true;
		e = false;
	} else {
		c = contains.call(dscr, 'c');
		e = contains.call(dscr, 'e');
	}

	desc = { get: get, set: set, configurable: c, enumerable: e };
	return !options ? desc : assign(normalizeOpts(options), desc);
};

},{"es5-ext/object/assign":"/home/kory/dev/weakmapsarefuckingamazing/instance-observable/node_modules/es6-weak-map/node_modules/es5-ext/object/assign/index.js","es5-ext/object/is-callable":"/home/kory/dev/weakmapsarefuckingamazing/instance-observable/node_modules/es6-weak-map/node_modules/es5-ext/object/is-callable.js","es5-ext/object/normalize-options":"/home/kory/dev/weakmapsarefuckingamazing/instance-observable/node_modules/es6-weak-map/node_modules/es5-ext/object/normalize-options.js","es5-ext/string/#/contains":"/home/kory/dev/weakmapsarefuckingamazing/instance-observable/node_modules/es6-weak-map/node_modules/es5-ext/string/#/contains/index.js"}],"/home/kory/dev/weakmapsarefuckingamazing/instance-observable/node_modules/es6-weak-map/node_modules/es5-ext/array/#/clear.js":[function(require,module,exports){
// Inspired by Google Closure:
// http://closure-library.googlecode.com/svn/docs/
// closure_goog_array_array.js.html#goog.array.clear

'use strict';

var value = require('../../object/valid-value');

module.exports = function () {
	value(this).length = 0;
	return this;
};

},{"../../object/valid-value":"/home/kory/dev/weakmapsarefuckingamazing/instance-observable/node_modules/es6-weak-map/node_modules/es5-ext/object/valid-value.js"}],"/home/kory/dev/weakmapsarefuckingamazing/instance-observable/node_modules/es6-weak-map/node_modules/es5-ext/object/_iterate.js":[function(require,module,exports){
// Internal method, used by iteration functions.
// Calls a function for each key-value pair found in object
// Optionally takes compareFn to iterate object in specific order

'use strict';

var isCallable = require('./is-callable')
  , callable   = require('./valid-callable')
  , value      = require('./valid-value')

  , call = Function.prototype.call, keys = Object.keys
  , propertyIsEnumerable = Object.prototype.propertyIsEnumerable;

module.exports = function (method, defVal) {
	return function (obj, cb/*, thisArg, compareFn*/) {
		var list, thisArg = arguments[2], compareFn = arguments[3];
		obj = Object(value(obj));
		callable(cb);

		list = keys(obj);
		if (compareFn) {
			list.sort(isCallable(compareFn) ? compareFn.bind(obj) : undefined);
		}
		return list[method](function (key, index) {
			if (!propertyIsEnumerable.call(obj, key)) return defVal;
			return call.call(cb, thisArg, obj[key], key, obj, index);
		});
	};
};

},{"./is-callable":"/home/kory/dev/weakmapsarefuckingamazing/instance-observable/node_modules/es6-weak-map/node_modules/es5-ext/object/is-callable.js","./valid-callable":"/home/kory/dev/weakmapsarefuckingamazing/instance-observable/node_modules/es6-weak-map/node_modules/es5-ext/object/valid-callable.js","./valid-value":"/home/kory/dev/weakmapsarefuckingamazing/instance-observable/node_modules/es6-weak-map/node_modules/es5-ext/object/valid-value.js"}],"/home/kory/dev/weakmapsarefuckingamazing/instance-observable/node_modules/es6-weak-map/node_modules/es5-ext/object/assign/index.js":[function(require,module,exports){
'use strict';

module.exports = require('./is-implemented')()
	? Object.assign
	: require('./shim');

},{"./is-implemented":"/home/kory/dev/weakmapsarefuckingamazing/instance-observable/node_modules/es6-weak-map/node_modules/es5-ext/object/assign/is-implemented.js","./shim":"/home/kory/dev/weakmapsarefuckingamazing/instance-observable/node_modules/es6-weak-map/node_modules/es5-ext/object/assign/shim.js"}],"/home/kory/dev/weakmapsarefuckingamazing/instance-observable/node_modules/es6-weak-map/node_modules/es5-ext/object/assign/is-implemented.js":[function(require,module,exports){
'use strict';

module.exports = function () {
	var assign = Object.assign, obj;
	if (typeof assign !== 'function') return false;
	obj = { foo: 'raz' };
	assign(obj, { bar: 'dwa' }, { trzy: 'trzy' });
	return (obj.foo + obj.bar + obj.trzy) === 'razdwatrzy';
};

},{}],"/home/kory/dev/weakmapsarefuckingamazing/instance-observable/node_modules/es6-weak-map/node_modules/es5-ext/object/assign/shim.js":[function(require,module,exports){
'use strict';

var keys  = require('../keys')
  , value = require('../valid-value')

  , max = Math.max;

module.exports = function (dest, src/*, …srcn*/) {
	var error, i, l = max(arguments.length, 2), assign;
	dest = Object(value(dest));
	assign = function (key) {
		try { dest[key] = src[key]; } catch (e) {
			if (!error) error = e;
		}
	};
	for (i = 1; i < l; ++i) {
		src = arguments[i];
		keys(src).forEach(assign);
	}
	if (error !== undefined) throw error;
	return dest;
};

},{"../keys":"/home/kory/dev/weakmapsarefuckingamazing/instance-observable/node_modules/es6-weak-map/node_modules/es5-ext/object/keys/index.js","../valid-value":"/home/kory/dev/weakmapsarefuckingamazing/instance-observable/node_modules/es6-weak-map/node_modules/es5-ext/object/valid-value.js"}],"/home/kory/dev/weakmapsarefuckingamazing/instance-observable/node_modules/es6-weak-map/node_modules/es5-ext/object/copy.js":[function(require,module,exports){
'use strict';

var assign = require('./assign')
  , value  = require('./valid-value');

module.exports = function (obj) {
	var copy = Object(value(obj));
	if (copy !== obj) return copy;
	return assign({}, obj);
};

},{"./assign":"/home/kory/dev/weakmapsarefuckingamazing/instance-observable/node_modules/es6-weak-map/node_modules/es5-ext/object/assign/index.js","./valid-value":"/home/kory/dev/weakmapsarefuckingamazing/instance-observable/node_modules/es6-weak-map/node_modules/es5-ext/object/valid-value.js"}],"/home/kory/dev/weakmapsarefuckingamazing/instance-observable/node_modules/es6-weak-map/node_modules/es5-ext/object/create.js":[function(require,module,exports){
// Workaround for http://code.google.com/p/v8/issues/detail?id=2804

'use strict';

var create = Object.create, shim;

if (!require('./set-prototype-of/is-implemented')()) {
	shim = require('./set-prototype-of/shim');
}

module.exports = (function () {
	var nullObject, props, desc;
	if (!shim) return create;
	if (shim.level !== 1) return create;

	nullObject = {};
	props = {};
	desc = { configurable: false, enumerable: false, writable: true,
		value: undefined };
	Object.getOwnPropertyNames(Object.prototype).forEach(function (name) {
		if (name === '__proto__') {
			props[name] = { configurable: true, enumerable: false, writable: true,
				value: undefined };
			return;
		}
		props[name] = desc;
	});
	Object.defineProperties(nullObject, props);

	Object.defineProperty(shim, 'nullPolyfill', { configurable: false,
		enumerable: false, writable: false, value: nullObject });

	return function (prototype, props) {
		return create((prototype === null) ? nullObject : prototype, props);
	};
}());

},{"./set-prototype-of/is-implemented":"/home/kory/dev/weakmapsarefuckingamazing/instance-observable/node_modules/es6-weak-map/node_modules/es5-ext/object/set-prototype-of/is-implemented.js","./set-prototype-of/shim":"/home/kory/dev/weakmapsarefuckingamazing/instance-observable/node_modules/es6-weak-map/node_modules/es5-ext/object/set-prototype-of/shim.js"}],"/home/kory/dev/weakmapsarefuckingamazing/instance-observable/node_modules/es6-weak-map/node_modules/es5-ext/object/for-each.js":[function(require,module,exports){
'use strict';

module.exports = require('./_iterate')('forEach');

},{"./_iterate":"/home/kory/dev/weakmapsarefuckingamazing/instance-observable/node_modules/es6-weak-map/node_modules/es5-ext/object/_iterate.js"}],"/home/kory/dev/weakmapsarefuckingamazing/instance-observable/node_modules/es6-weak-map/node_modules/es5-ext/object/is-callable.js":[function(require,module,exports){
// Deprecated

'use strict';

module.exports = function (obj) { return typeof obj === 'function'; };

},{}],"/home/kory/dev/weakmapsarefuckingamazing/instance-observable/node_modules/es6-weak-map/node_modules/es5-ext/object/is-object.js":[function(require,module,exports){
'use strict';

var map = { function: true, object: true };

module.exports = function (x) {
	return ((x != null) && map[typeof x]) || false;
};

},{}],"/home/kory/dev/weakmapsarefuckingamazing/instance-observable/node_modules/es6-weak-map/node_modules/es5-ext/object/keys/index.js":[function(require,module,exports){
'use strict';

module.exports = require('./is-implemented')()
	? Object.keys
	: require('./shim');

},{"./is-implemented":"/home/kory/dev/weakmapsarefuckingamazing/instance-observable/node_modules/es6-weak-map/node_modules/es5-ext/object/keys/is-implemented.js","./shim":"/home/kory/dev/weakmapsarefuckingamazing/instance-observable/node_modules/es6-weak-map/node_modules/es5-ext/object/keys/shim.js"}],"/home/kory/dev/weakmapsarefuckingamazing/instance-observable/node_modules/es6-weak-map/node_modules/es5-ext/object/keys/is-implemented.js":[function(require,module,exports){
'use strict';

module.exports = function () {
	try {
		Object.keys('primitive');
		return true;
	} catch (e) { return false; }
};

},{}],"/home/kory/dev/weakmapsarefuckingamazing/instance-observable/node_modules/es6-weak-map/node_modules/es5-ext/object/keys/shim.js":[function(require,module,exports){
'use strict';

var keys = Object.keys;

module.exports = function (object) {
	return keys(object == null ? object : Object(object));
};

},{}],"/home/kory/dev/weakmapsarefuckingamazing/instance-observable/node_modules/es6-weak-map/node_modules/es5-ext/object/map.js":[function(require,module,exports){
'use strict';

var callable = require('./valid-callable')
  , forEach  = require('./for-each')

  , call = Function.prototype.call;

module.exports = function (obj, cb/*, thisArg*/) {
	var o = {}, thisArg = arguments[2];
	callable(cb);
	forEach(obj, function (value, key, obj, index) {
		o[key] = call.call(cb, thisArg, value, key, obj, index);
	});
	return o;
};

},{"./for-each":"/home/kory/dev/weakmapsarefuckingamazing/instance-observable/node_modules/es6-weak-map/node_modules/es5-ext/object/for-each.js","./valid-callable":"/home/kory/dev/weakmapsarefuckingamazing/instance-observable/node_modules/es6-weak-map/node_modules/es5-ext/object/valid-callable.js"}],"/home/kory/dev/weakmapsarefuckingamazing/instance-observable/node_modules/es6-weak-map/node_modules/es5-ext/object/normalize-options.js":[function(require,module,exports){
'use strict';

var forEach = Array.prototype.forEach, create = Object.create;

var process = function (src, obj) {
	var key;
	for (key in src) obj[key] = src[key];
};

module.exports = function (options/*, …options*/) {
	var result = create(null);
	forEach.call(arguments, function (options) {
		if (options == null) return;
		process(Object(options), result);
	});
	return result;
};

},{}],"/home/kory/dev/weakmapsarefuckingamazing/instance-observable/node_modules/es6-weak-map/node_modules/es5-ext/object/set-prototype-of/index.js":[function(require,module,exports){
'use strict';

module.exports = require('./is-implemented')()
	? Object.setPrototypeOf
	: require('./shim');

},{"./is-implemented":"/home/kory/dev/weakmapsarefuckingamazing/instance-observable/node_modules/es6-weak-map/node_modules/es5-ext/object/set-prototype-of/is-implemented.js","./shim":"/home/kory/dev/weakmapsarefuckingamazing/instance-observable/node_modules/es6-weak-map/node_modules/es5-ext/object/set-prototype-of/shim.js"}],"/home/kory/dev/weakmapsarefuckingamazing/instance-observable/node_modules/es6-weak-map/node_modules/es5-ext/object/set-prototype-of/is-implemented.js":[function(require,module,exports){
'use strict';

var create = Object.create, getPrototypeOf = Object.getPrototypeOf
  , x = {};

module.exports = function (/*customCreate*/) {
	var setPrototypeOf = Object.setPrototypeOf
	  , customCreate = arguments[0] || create;
	if (typeof setPrototypeOf !== 'function') return false;
	return getPrototypeOf(setPrototypeOf(customCreate(null), x)) === x;
};

},{}],"/home/kory/dev/weakmapsarefuckingamazing/instance-observable/node_modules/es6-weak-map/node_modules/es5-ext/object/set-prototype-of/shim.js":[function(require,module,exports){
// Big thanks to @WebReflection for sorting this out
// https://gist.github.com/WebReflection/5593554

'use strict';

var isObject      = require('../is-object')
  , value         = require('../valid-value')

  , isPrototypeOf = Object.prototype.isPrototypeOf
  , defineProperty = Object.defineProperty
  , nullDesc = { configurable: true, enumerable: false, writable: true,
		value: undefined }
  , validate;

validate = function (obj, prototype) {
	value(obj);
	if ((prototype === null) || isObject(prototype)) return obj;
	throw new TypeError('Prototype must be null or an object');
};

module.exports = (function (status) {
	var fn, set;
	if (!status) return null;
	if (status.level === 2) {
		if (status.set) {
			set = status.set;
			fn = function (obj, prototype) {
				set.call(validate(obj, prototype), prototype);
				return obj;
			};
		} else {
			fn = function (obj, prototype) {
				validate(obj, prototype).__proto__ = prototype;
				return obj;
			};
		}
	} else {
		fn = function self(obj, prototype) {
			var isNullBase;
			validate(obj, prototype);
			isNullBase = isPrototypeOf.call(self.nullPolyfill, obj);
			if (isNullBase) delete self.nullPolyfill.__proto__;
			if (prototype === null) prototype = self.nullPolyfill;
			obj.__proto__ = prototype;
			if (isNullBase) defineProperty(self.nullPolyfill, '__proto__', nullDesc);
			return obj;
		};
	}
	return Object.defineProperty(fn, 'level', { configurable: false,
		enumerable: false, writable: false, value: status.level });
}((function () {
	var x = Object.create(null), y = {}, set
	  , desc = Object.getOwnPropertyDescriptor(Object.prototype, '__proto__');

	if (desc) {
		try {
			set = desc.set; // Opera crashes at this point
			set.call(x, y);
		} catch (ignore) { }
		if (Object.getPrototypeOf(x) === y) return { set: set, level: 2 };
	}

	x.__proto__ = y;
	if (Object.getPrototypeOf(x) === y) return { level: 2 };

	x = {};
	x.__proto__ = y;
	if (Object.getPrototypeOf(x) === y) return { level: 1 };

	return false;
}())));

require('../create');

},{"../create":"/home/kory/dev/weakmapsarefuckingamazing/instance-observable/node_modules/es6-weak-map/node_modules/es5-ext/object/create.js","../is-object":"/home/kory/dev/weakmapsarefuckingamazing/instance-observable/node_modules/es6-weak-map/node_modules/es5-ext/object/is-object.js","../valid-value":"/home/kory/dev/weakmapsarefuckingamazing/instance-observable/node_modules/es6-weak-map/node_modules/es5-ext/object/valid-value.js"}],"/home/kory/dev/weakmapsarefuckingamazing/instance-observable/node_modules/es6-weak-map/node_modules/es5-ext/object/valid-callable.js":[function(require,module,exports){
'use strict';

module.exports = function (fn) {
	if (typeof fn !== 'function') throw new TypeError(fn + " is not a function");
	return fn;
};

},{}],"/home/kory/dev/weakmapsarefuckingamazing/instance-observable/node_modules/es6-weak-map/node_modules/es5-ext/object/valid-object.js":[function(require,module,exports){
'use strict';

var isObject = require('./is-object');

module.exports = function (value) {
	if (!isObject(value)) throw new TypeError(value + " is not an Object");
	return value;
};

},{"./is-object":"/home/kory/dev/weakmapsarefuckingamazing/instance-observable/node_modules/es6-weak-map/node_modules/es5-ext/object/is-object.js"}],"/home/kory/dev/weakmapsarefuckingamazing/instance-observable/node_modules/es6-weak-map/node_modules/es5-ext/object/valid-value.js":[function(require,module,exports){
'use strict';

module.exports = function (value) {
	if (value == null) throw new TypeError("Cannot use null or undefined");
	return value;
};

},{}],"/home/kory/dev/weakmapsarefuckingamazing/instance-observable/node_modules/es6-weak-map/node_modules/es5-ext/string/#/contains/index.js":[function(require,module,exports){
'use strict';

module.exports = require('./is-implemented')()
	? String.prototype.contains
	: require('./shim');

},{"./is-implemented":"/home/kory/dev/weakmapsarefuckingamazing/instance-observable/node_modules/es6-weak-map/node_modules/es5-ext/string/#/contains/is-implemented.js","./shim":"/home/kory/dev/weakmapsarefuckingamazing/instance-observable/node_modules/es6-weak-map/node_modules/es5-ext/string/#/contains/shim.js"}],"/home/kory/dev/weakmapsarefuckingamazing/instance-observable/node_modules/es6-weak-map/node_modules/es5-ext/string/#/contains/is-implemented.js":[function(require,module,exports){
'use strict';

var str = 'razdwatrzy';

module.exports = function () {
	if (typeof str.contains !== 'function') return false;
	return ((str.contains('dwa') === true) && (str.contains('foo') === false));
};

},{}],"/home/kory/dev/weakmapsarefuckingamazing/instance-observable/node_modules/es6-weak-map/node_modules/es5-ext/string/#/contains/shim.js":[function(require,module,exports){
'use strict';

var indexOf = String.prototype.indexOf;

module.exports = function (searchString/*, position*/) {
	return indexOf.call(this, searchString, arguments[1]) > -1;
};

},{}],"/home/kory/dev/weakmapsarefuckingamazing/instance-observable/node_modules/es6-weak-map/node_modules/es5-ext/string/is-string.js":[function(require,module,exports){
'use strict';

var toString = Object.prototype.toString

  , id = toString.call('');

module.exports = function (x) {
	return (typeof x === 'string') || (x && (typeof x === 'object') &&
		((x instanceof String) || (toString.call(x) === id))) || false;
};

},{}],"/home/kory/dev/weakmapsarefuckingamazing/instance-observable/node_modules/es6-weak-map/node_modules/es5-ext/string/random-uniq.js":[function(require,module,exports){
'use strict';

var generated = Object.create(null)

  , random = Math.random;

module.exports = function () {
	var str;
	do { str = random().toString(36).slice(2); } while (generated[str]);
	return str;
};

},{}],"/home/kory/dev/weakmapsarefuckingamazing/instance-observable/node_modules/es6-weak-map/node_modules/es6-iterator/array.js":[function(require,module,exports){
'use strict';

var setPrototypeOf = require('es5-ext/object/set-prototype-of')
  , contains       = require('es5-ext/string/#/contains')
  , d              = require('d')
  , Iterator       = require('./')

  , defineProperty = Object.defineProperty
  , ArrayIterator;

ArrayIterator = module.exports = function (arr, kind) {
	if (!(this instanceof ArrayIterator)) return new ArrayIterator(arr, kind);
	Iterator.call(this, arr);
	if (!kind) kind = 'value';
	else if (contains.call(kind, 'key+value')) kind = 'key+value';
	else if (contains.call(kind, 'key')) kind = 'key';
	else kind = 'value';
	defineProperty(this, '__kind__', d('', kind));
};
if (setPrototypeOf) setPrototypeOf(ArrayIterator, Iterator);

ArrayIterator.prototype = Object.create(Iterator.prototype, {
	constructor: d(ArrayIterator),
	_resolve: d(function (i) {
		if (this.__kind__ === 'value') return this.__list__[i];
		if (this.__kind__ === 'key+value') return [i, this.__list__[i]];
		return i;
	}),
	toString: d(function () { return '[object Array Iterator]'; })
});

},{"./":"/home/kory/dev/weakmapsarefuckingamazing/instance-observable/node_modules/es6-weak-map/node_modules/es6-iterator/index.js","d":"/home/kory/dev/weakmapsarefuckingamazing/instance-observable/node_modules/es6-weak-map/node_modules/d/index.js","es5-ext/object/set-prototype-of":"/home/kory/dev/weakmapsarefuckingamazing/instance-observable/node_modules/es6-weak-map/node_modules/es5-ext/object/set-prototype-of/index.js","es5-ext/string/#/contains":"/home/kory/dev/weakmapsarefuckingamazing/instance-observable/node_modules/es6-weak-map/node_modules/es5-ext/string/#/contains/index.js"}],"/home/kory/dev/weakmapsarefuckingamazing/instance-observable/node_modules/es6-weak-map/node_modules/es6-iterator/for-of.js":[function(require,module,exports){
'use strict';

var callable = require('es5-ext/object/valid-callable')
  , isString = require('es5-ext/string/is-string')
  , get      = require('./get')

  , isArray = Array.isArray, call = Function.prototype.call;

module.exports = function (iterable, cb/*, thisArg*/) {
	var mode, thisArg = arguments[2], result, doBreak, broken, i, l, char, code;
	if (isArray(iterable)) mode = 'array';
	else if (isString(iterable)) mode = 'string';
	else iterable = get(iterable);

	callable(cb);
	doBreak = function () { broken = true; };
	if (mode === 'array') {
		iterable.some(function (value) {
			call.call(cb, thisArg, value, doBreak);
			if (broken) return true;
		});
		return;
	}
	if (mode === 'string') {
		l = iterable.length;
		for (i = 0; i < l; ++i) {
			char = iterable[i];
			if ((i + 1) < l) {
				code = char.charCodeAt(0);
				if ((code >= 0xD800) && (code <= 0xDBFF)) char += iterable[++i];
			}
			call.call(cb, thisArg, char, doBreak);
			if (broken) break;
		}
		return;
	}
	result = iterable.next();

	while (!result.done) {
		call.call(cb, thisArg, result.value, doBreak);
		if (broken) return;
		result = iterable.next();
	}
};

},{"./get":"/home/kory/dev/weakmapsarefuckingamazing/instance-observable/node_modules/es6-weak-map/node_modules/es6-iterator/get.js","es5-ext/object/valid-callable":"/home/kory/dev/weakmapsarefuckingamazing/instance-observable/node_modules/es6-weak-map/node_modules/es5-ext/object/valid-callable.js","es5-ext/string/is-string":"/home/kory/dev/weakmapsarefuckingamazing/instance-observable/node_modules/es6-weak-map/node_modules/es5-ext/string/is-string.js"}],"/home/kory/dev/weakmapsarefuckingamazing/instance-observable/node_modules/es6-weak-map/node_modules/es6-iterator/get.js":[function(require,module,exports){
'use strict';

var isString = require('es5-ext/string/is-string')
  , ArrayIterator  = require('./array')
  , StringIterator = require('./string')
  , iterable       = require('./valid-iterable')
  , iteratorSymbol = require('es6-symbol').iterator;

module.exports = function (obj) {
	if (typeof iterable(obj)[iteratorSymbol] === 'function') return obj[iteratorSymbol]();
	if (isString(obj)) return new StringIterator(obj);
	return new ArrayIterator(obj);
};

},{"./array":"/home/kory/dev/weakmapsarefuckingamazing/instance-observable/node_modules/es6-weak-map/node_modules/es6-iterator/array.js","./string":"/home/kory/dev/weakmapsarefuckingamazing/instance-observable/node_modules/es6-weak-map/node_modules/es6-iterator/string.js","./valid-iterable":"/home/kory/dev/weakmapsarefuckingamazing/instance-observable/node_modules/es6-weak-map/node_modules/es6-iterator/valid-iterable.js","es5-ext/string/is-string":"/home/kory/dev/weakmapsarefuckingamazing/instance-observable/node_modules/es6-weak-map/node_modules/es5-ext/string/is-string.js","es6-symbol":"/home/kory/dev/weakmapsarefuckingamazing/instance-observable/node_modules/es6-weak-map/node_modules/es6-symbol/index.js"}],"/home/kory/dev/weakmapsarefuckingamazing/instance-observable/node_modules/es6-weak-map/node_modules/es6-iterator/index.js":[function(require,module,exports){
'use strict';

var clear    = require('es5-ext/array/#/clear')
  , assign   = require('es5-ext/object/assign')
  , callable = require('es5-ext/object/valid-callable')
  , value    = require('es5-ext/object/valid-value')
  , d        = require('d')
  , autoBind = require('d/auto-bind')
  , Symbol   = require('es6-symbol')

  , defineProperty = Object.defineProperty
  , defineProperties = Object.defineProperties
  , Iterator;

module.exports = Iterator = function (list, context) {
	if (!(this instanceof Iterator)) return new Iterator(list, context);
	defineProperties(this, {
		__list__: d('w', value(list)),
		__context__: d('w', context),
		__nextIndex__: d('w', 0)
	});
	if (!context) return;
	callable(context.on);
	context.on('_add', this._onAdd);
	context.on('_delete', this._onDelete);
	context.on('_clear', this._onClear);
};

defineProperties(Iterator.prototype, assign({
	constructor: d(Iterator),
	_next: d(function () {
		var i;
		if (!this.__list__) return;
		if (this.__redo__) {
			i = this.__redo__.shift();
			if (i !== undefined) return i;
		}
		if (this.__nextIndex__ < this.__list__.length) return this.__nextIndex__++;
		this._unBind();
	}),
	next: d(function () { return this._createResult(this._next()); }),
	_createResult: d(function (i) {
		if (i === undefined) return { done: true, value: undefined };
		return { done: false, value: this._resolve(i) };
	}),
	_resolve: d(function (i) { return this.__list__[i]; }),
	_unBind: d(function () {
		this.__list__ = null;
		delete this.__redo__;
		if (!this.__context__) return;
		this.__context__.off('_add', this._onAdd);
		this.__context__.off('_delete', this._onDelete);
		this.__context__.off('_clear', this._onClear);
		this.__context__ = null;
	}),
	toString: d(function () { return '[object Iterator]'; })
}, autoBind({
	_onAdd: d(function (index) {
		if (index >= this.__nextIndex__) return;
		++this.__nextIndex__;
		if (!this.__redo__) {
			defineProperty(this, '__redo__', d('c', [index]));
			return;
		}
		this.__redo__.forEach(function (redo, i) {
			if (redo >= index) this.__redo__[i] = ++redo;
		}, this);
		this.__redo__.push(index);
	}),
	_onDelete: d(function (index) {
		var i;
		if (index >= this.__nextIndex__) return;
		--this.__nextIndex__;
		if (!this.__redo__) return;
		i = this.__redo__.indexOf(index);
		if (i !== -1) this.__redo__.splice(i, 1);
		this.__redo__.forEach(function (redo, i) {
			if (redo > index) this.__redo__[i] = --redo;
		}, this);
	}),
	_onClear: d(function () {
		if (this.__redo__) clear.call(this.__redo__);
		this.__nextIndex__ = 0;
	})
})));

defineProperty(Iterator.prototype, Symbol.iterator, d(function () {
	return this;
}));
defineProperty(Iterator.prototype, Symbol.toStringTag, d('', 'Iterator'));

},{"d":"/home/kory/dev/weakmapsarefuckingamazing/instance-observable/node_modules/es6-weak-map/node_modules/d/index.js","d/auto-bind":"/home/kory/dev/weakmapsarefuckingamazing/instance-observable/node_modules/es6-weak-map/node_modules/d/auto-bind.js","es5-ext/array/#/clear":"/home/kory/dev/weakmapsarefuckingamazing/instance-observable/node_modules/es6-weak-map/node_modules/es5-ext/array/#/clear.js","es5-ext/object/assign":"/home/kory/dev/weakmapsarefuckingamazing/instance-observable/node_modules/es6-weak-map/node_modules/es5-ext/object/assign/index.js","es5-ext/object/valid-callable":"/home/kory/dev/weakmapsarefuckingamazing/instance-observable/node_modules/es6-weak-map/node_modules/es5-ext/object/valid-callable.js","es5-ext/object/valid-value":"/home/kory/dev/weakmapsarefuckingamazing/instance-observable/node_modules/es6-weak-map/node_modules/es5-ext/object/valid-value.js","es6-symbol":"/home/kory/dev/weakmapsarefuckingamazing/instance-observable/node_modules/es6-weak-map/node_modules/es6-symbol/index.js"}],"/home/kory/dev/weakmapsarefuckingamazing/instance-observable/node_modules/es6-weak-map/node_modules/es6-iterator/is-iterable.js":[function(require,module,exports){
'use strict';

var isString       = require('es5-ext/string/is-string')
  , iteratorSymbol = require('es6-symbol').iterator

  , isArray = Array.isArray;

module.exports = function (value) {
	if (value == null) return false;
	if (isArray(value)) return true;
	if (isString(value)) return true;
	return (typeof value[iteratorSymbol] === 'function');
};

},{"es5-ext/string/is-string":"/home/kory/dev/weakmapsarefuckingamazing/instance-observable/node_modules/es6-weak-map/node_modules/es5-ext/string/is-string.js","es6-symbol":"/home/kory/dev/weakmapsarefuckingamazing/instance-observable/node_modules/es6-weak-map/node_modules/es6-symbol/index.js"}],"/home/kory/dev/weakmapsarefuckingamazing/instance-observable/node_modules/es6-weak-map/node_modules/es6-iterator/string.js":[function(require,module,exports){
// Thanks @mathiasbynens
// http://mathiasbynens.be/notes/javascript-unicode#iterating-over-symbols

'use strict';

var setPrototypeOf = require('es5-ext/object/set-prototype-of')
  , d              = require('d')
  , Iterator       = require('./')

  , defineProperty = Object.defineProperty
  , StringIterator;

StringIterator = module.exports = function (str) {
	if (!(this instanceof StringIterator)) return new StringIterator(str);
	str = String(str);
	Iterator.call(this, str);
	defineProperty(this, '__length__', d('', str.length));

};
if (setPrototypeOf) setPrototypeOf(StringIterator, Iterator);

StringIterator.prototype = Object.create(Iterator.prototype, {
	constructor: d(StringIterator),
	_next: d(function () {
		if (!this.__list__) return;
		if (this.__nextIndex__ < this.__length__) return this.__nextIndex__++;
		this._unBind();
	}),
	_resolve: d(function (i) {
		var char = this.__list__[i], code;
		if (this.__nextIndex__ === this.__length__) return char;
		code = char.charCodeAt(0);
		if ((code >= 0xD800) && (code <= 0xDBFF)) return char + this.__list__[this.__nextIndex__++];
		return char;
	}),
	toString: d(function () { return '[object String Iterator]'; })
});

},{"./":"/home/kory/dev/weakmapsarefuckingamazing/instance-observable/node_modules/es6-weak-map/node_modules/es6-iterator/index.js","d":"/home/kory/dev/weakmapsarefuckingamazing/instance-observable/node_modules/es6-weak-map/node_modules/d/index.js","es5-ext/object/set-prototype-of":"/home/kory/dev/weakmapsarefuckingamazing/instance-observable/node_modules/es6-weak-map/node_modules/es5-ext/object/set-prototype-of/index.js"}],"/home/kory/dev/weakmapsarefuckingamazing/instance-observable/node_modules/es6-weak-map/node_modules/es6-iterator/valid-iterable.js":[function(require,module,exports){
'use strict';

var isIterable = require('./is-iterable');

module.exports = function (value) {
	if (!isIterable(value)) throw new TypeError(value + " is not iterable");
	return value;
};

},{"./is-iterable":"/home/kory/dev/weakmapsarefuckingamazing/instance-observable/node_modules/es6-weak-map/node_modules/es6-iterator/is-iterable.js"}],"/home/kory/dev/weakmapsarefuckingamazing/instance-observable/node_modules/es6-weak-map/node_modules/es6-symbol/index.js":[function(require,module,exports){
'use strict';

module.exports = require('./is-implemented')() ? Symbol : require('./polyfill');

},{"./is-implemented":"/home/kory/dev/weakmapsarefuckingamazing/instance-observable/node_modules/es6-weak-map/node_modules/es6-symbol/is-implemented.js","./polyfill":"/home/kory/dev/weakmapsarefuckingamazing/instance-observable/node_modules/es6-weak-map/node_modules/es6-symbol/polyfill.js"}],"/home/kory/dev/weakmapsarefuckingamazing/instance-observable/node_modules/es6-weak-map/node_modules/es6-symbol/is-implemented.js":[function(require,module,exports){
'use strict';

module.exports = function () {
	var symbol;
	if (typeof Symbol !== 'function') return false;
	symbol = Symbol('test symbol');
	try { String(symbol); } catch (e) { return false; }
	if (typeof Symbol.iterator === 'symbol') return true;

	// Return 'true' for polyfills
	if (typeof Symbol.isConcatSpreadable !== 'object') return false;
	if (typeof Symbol.iterator !== 'object') return false;
	if (typeof Symbol.toPrimitive !== 'object') return false;
	if (typeof Symbol.toStringTag !== 'object') return false;
	if (typeof Symbol.unscopables !== 'object') return false;

	return true;
};

},{}],"/home/kory/dev/weakmapsarefuckingamazing/instance-observable/node_modules/es6-weak-map/node_modules/es6-symbol/is-symbol.js":[function(require,module,exports){
'use strict';

module.exports = function (x) {
	return (x && ((typeof x === 'symbol') || (x['@@toStringTag'] === 'Symbol'))) || false;
};

},{}],"/home/kory/dev/weakmapsarefuckingamazing/instance-observable/node_modules/es6-weak-map/node_modules/es6-symbol/polyfill.js":[function(require,module,exports){
'use strict';

var d              = require('d')
  , validateSymbol = require('./validate-symbol')

  , create = Object.create, defineProperties = Object.defineProperties
  , defineProperty = Object.defineProperty, objPrototype = Object.prototype
  , Symbol, HiddenSymbol, globalSymbols = create(null);

var generateName = (function () {
	var created = create(null);
	return function (desc) {
		var postfix = 0, name;
		while (created[desc + (postfix || '')]) ++postfix;
		desc += (postfix || '');
		created[desc] = true;
		name = '@@' + desc;
		defineProperty(objPrototype, name, d.gs(null, function (value) {
			defineProperty(this, name, d(value));
		}));
		return name;
	};
}());

HiddenSymbol = function Symbol(description) {
	if (this instanceof HiddenSymbol) throw new TypeError('TypeError: Symbol is not a constructor');
	return Symbol(description);
};
module.exports = Symbol = function Symbol(description) {
	var symbol;
	if (this instanceof Symbol) throw new TypeError('TypeError: Symbol is not a constructor');
	symbol = create(HiddenSymbol.prototype);
	description = (description === undefined ? '' : String(description));
	return defineProperties(symbol, {
		__description__: d('', description),
		__name__: d('', generateName(description))
	});
};
defineProperties(Symbol, {
	for: d(function (key) {
		if (globalSymbols[key]) return globalSymbols[key];
		return (globalSymbols[key] = Symbol(String(key)));
	}),
	keyFor: d(function (s) {
		var key;
		validateSymbol(s);
		for (key in globalSymbols) if (globalSymbols[key] === s) return key;
	}),
	hasInstance: d('', Symbol('hasInstance')),
	isConcatSpreadable: d('', Symbol('isConcatSpreadable')),
	iterator: d('', Symbol('iterator')),
	match: d('', Symbol('match')),
	replace: d('', Symbol('replace')),
	search: d('', Symbol('search')),
	species: d('', Symbol('species')),
	split: d('', Symbol('split')),
	toPrimitive: d('', Symbol('toPrimitive')),
	toStringTag: d('', Symbol('toStringTag')),
	unscopables: d('', Symbol('unscopables'))
});
defineProperties(HiddenSymbol.prototype, {
	constructor: d(Symbol),
	toString: d('', function () { return this.__name__; })
});

defineProperties(Symbol.prototype, {
	toString: d(function () { return 'Symbol (' + validateSymbol(this).__description__ + ')'; }),
	valueOf: d(function () { return validateSymbol(this); })
});
defineProperty(Symbol.prototype, Symbol.toPrimitive, d('',
	function () { return validateSymbol(this); }));
defineProperty(Symbol.prototype, Symbol.toStringTag, d('c', 'Symbol'));

defineProperty(HiddenSymbol.prototype, Symbol.toPrimitive,
	d('c', Symbol.prototype[Symbol.toPrimitive]));
defineProperty(HiddenSymbol.prototype, Symbol.toStringTag,
	d('c', Symbol.prototype[Symbol.toStringTag]));

},{"./validate-symbol":"/home/kory/dev/weakmapsarefuckingamazing/instance-observable/node_modules/es6-weak-map/node_modules/es6-symbol/validate-symbol.js","d":"/home/kory/dev/weakmapsarefuckingamazing/instance-observable/node_modules/es6-weak-map/node_modules/d/index.js"}],"/home/kory/dev/weakmapsarefuckingamazing/instance-observable/node_modules/es6-weak-map/node_modules/es6-symbol/validate-symbol.js":[function(require,module,exports){
'use strict';

var isSymbol = require('./is-symbol');

module.exports = function (value) {
	if (!isSymbol(value)) throw new TypeError(value + " is not a symbol");
	return value;
};

},{"./is-symbol":"/home/kory/dev/weakmapsarefuckingamazing/instance-observable/node_modules/es6-weak-map/node_modules/es6-symbol/is-symbol.js"}],"/home/kory/dev/weakmapsarefuckingamazing/instance-observable/node_modules/es6-weak-map/polyfill.js":[function(require,module,exports){
'use strict';

var setPrototypeOf    = require('es5-ext/object/set-prototype-of')
  , object            = require('es5-ext/object/valid-object')
  , value             = require('es5-ext/object/valid-value')
  , randomUniq        = require('es5-ext/string/random-uniq')
  , d                 = require('d')
  , getIterator       = require('es6-iterator/get')
  , forOf             = require('es6-iterator/for-of')
  , toStringTagSymbol = require('es6-symbol').toStringTag
  , isNative          = require('./is-native-implemented')

  , isArray = Array.isArray, defineProperty = Object.defineProperty
  , hasOwnProperty = Object.prototype.hasOwnProperty, getPrototypeOf = Object.getPrototypeOf
  , WeakMapPoly;

module.exports = WeakMapPoly = function (/*iterable*/) {
	var iterable = arguments[0], self;
	if (!(this instanceof WeakMapPoly)) throw new TypeError('Constructor requires \'new\'');
	if (isNative && setPrototypeOf && (WeakMap !== WeakMapPoly)) {
		self = setPrototypeOf(new WeakMap(), getPrototypeOf(this));
	} else {
		self = this;
	}
	if (iterable != null) {
		if (!isArray(iterable)) iterable = getIterator(iterable);
	}
	defineProperty(self, '__weakMapData__', d('c', '$weakMap$' + randomUniq()));
	if (!iterable) return self;
	forOf(iterable, function (val) {
		value(val);
		self.set(val[0], val[1]);
	});
	return self;
};

if (isNative) {
	if (setPrototypeOf) setPrototypeOf(WeakMapPoly, WeakMap);
	WeakMapPoly.prototype = Object.create(WeakMap.prototype, {
		constructor: d(WeakMapPoly)
	});
}

Object.defineProperties(WeakMapPoly.prototype, {
	delete: d(function (key) {
		if (hasOwnProperty.call(object(key), this.__weakMapData__)) {
			delete key[this.__weakMapData__];
			return true;
		}
		return false;
	}),
	get: d(function (key) {
		if (hasOwnProperty.call(object(key), this.__weakMapData__)) {
			return key[this.__weakMapData__];
		}
	}),
	has: d(function (key) {
		return hasOwnProperty.call(object(key), this.__weakMapData__);
	}),
	set: d(function (key, value) {
		defineProperty(object(key), this.__weakMapData__, d('c', value));
		return this;
	}),
	toString: d(function () { return '[object WeakMap]'; })
});
defineProperty(WeakMapPoly.prototype, toStringTagSymbol, d('c', 'WeakMap'));

},{"./is-native-implemented":"/home/kory/dev/weakmapsarefuckingamazing/instance-observable/node_modules/es6-weak-map/is-native-implemented.js","d":"/home/kory/dev/weakmapsarefuckingamazing/instance-observable/node_modules/es6-weak-map/node_modules/d/index.js","es5-ext/object/set-prototype-of":"/home/kory/dev/weakmapsarefuckingamazing/instance-observable/node_modules/es6-weak-map/node_modules/es5-ext/object/set-prototype-of/index.js","es5-ext/object/valid-object":"/home/kory/dev/weakmapsarefuckingamazing/instance-observable/node_modules/es6-weak-map/node_modules/es5-ext/object/valid-object.js","es5-ext/object/valid-value":"/home/kory/dev/weakmapsarefuckingamazing/instance-observable/node_modules/es6-weak-map/node_modules/es5-ext/object/valid-value.js","es5-ext/string/random-uniq":"/home/kory/dev/weakmapsarefuckingamazing/instance-observable/node_modules/es6-weak-map/node_modules/es5-ext/string/random-uniq.js","es6-iterator/for-of":"/home/kory/dev/weakmapsarefuckingamazing/instance-observable/node_modules/es6-weak-map/node_modules/es6-iterator/for-of.js","es6-iterator/get":"/home/kory/dev/weakmapsarefuckingamazing/instance-observable/node_modules/es6-weak-map/node_modules/es6-iterator/get.js","es6-symbol":"/home/kory/dev/weakmapsarefuckingamazing/instance-observable/node_modules/es6-weak-map/node_modules/es6-symbol/index.js"}],"/home/kory/dev/weakmapsarefuckingamazing/instance-observable/observable.js":[function(require,module,exports){
module.exports = require('./weakmap-observable');
},{"./weakmap-observable":"/home/kory/dev/weakmapsarefuckingamazing/instance-observable/weakmap-observable.js"}],"/home/kory/dev/weakmapsarefuckingamazing/instance-observable/weakmap-observable.js":[function(require,module,exports){
var WeakMap = require('es6-weak-map'),
    trackedInstances = new WeakMap();

function on(object, key, handler){
    var type = typeof object;

    if(!object || (type !== 'object' && type !== 'function')){
        throw new Error('value was not an object or function');
    }

    var objectEvents = trackedInstances.get(object);

    if(!objectEvents){
        objectEvents = {};
        trackedInstances.set(object, objectEvents);
    }

    var listeners = objectEvents[key];

    if(!listeners){
        listeners = [];
        objectEvents[key] = listeners;
    }

    listeners.push(handler);
}

function emit(object, key, value){
    var objectEvents = trackedInstances.get(object);

    if(!objectEvents){
        return;
    }

    var listeners = objectEvents[key];

    if(!listeners){
        return;
    }

    listeners.forEach(function(listener){
        listener(value);
    });
}

function set(object, key, value){
    object[key] = value;
    emit(object, key, value);
}

module.exports = {
    on: on,
    emit: emit,
    set: set
};
},{"es6-weak-map":"/home/kory/dev/weakmapsarefuckingamazing/instance-observable/node_modules/es6-weak-map/index.js"}]},{},["/home/kory/dev/weakmapsarefuckingamazing/instance-observable/index.js"]);
