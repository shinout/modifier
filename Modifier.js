var Modifier = {
  /* validators */

  integer: function(v) {
    var min = Modifier.numberize(this.min, undefined);
    var max = Modifier.numberize(this.max, undefined);
    var strict = !!this.strict;

    if (typeof v != 'number') {
      if (strict) return Modifier.error.call(this, {reason: 'notNumber', val: v});
    }
    var vI = parseInt(v);
    if (isNaN(vI)) return Modifier.error.call(this, {reason: 'NaN', val: v});
    if (min != null && vI < min) return Modifier.error({reason: 'min', val: v});
    if (max != null && vI > max) return Modifier.error.call(this, {reason: 'max', val: v});
    return vI;
  },

  number: function(v) {
    var min = Modifier.numberize(this.min, undefined);
    var max = Modifier.numberize(this.max, undefined);
    var strict = !!this.strict;

    if (typeof v != 'number') {
      if (strict) {
        return Modifier.error.call(this, {reason: 'notNumber', val: v});
      }
      else {
        var vI = Number(v);
      }
    }
    else {
      vI = v;
    }
    if (isNaN(vI)) return Modifier.error.call(this, {reason: 'NaN', val: v});
    if (min != null && vI < min) return Modifier.error.call(this, {reason: 'min', val: v});
    if (max != null && vI > max) return Modifier.error.call(this, {reason: 'max', val: v});
    return vI;
  },

  string: function(v) {
    var min = Modifier.numberize(this.min, undefined);
    var max = Modifier.numberize(this.max, undefined);
    if (typeof v != 'string') {
      if (this.strict) {
        return Modifier.error.call(this, {reason: 'notString', val: v});
      }
      else if (v != null) {
        v = v.toString();
      }
      else {
        v = '';
      }
    }
    var len = v.length;
    if (min != null && len < min) return Modifier.error.call(this, {reason: 'minLength', val: v});
    if (max != null && len > max) return Modifier.error.call(this, {reason: 'maxLength', val: v});
    return v;
  },

  bool : function(v) {
		if (this.strict && (v !== false || v !== true)) return Modifier.error.call(this, {reason: 'notBool', val: v});
		if (this.zerostr) return  v != 0;
		return !!v;
	},

  array: function(v) {
    if (!Array.isArray(v))
      return Modifier.error.call(this, {reason: 'notArray', val: v});

    var min = Modifier.numberize(this.min, undefined);
    var max = Modifier.numberize(this.max, undefined);
    var len = v.length;
    if (min != null && len < min) return Modifier.error.call(this, {reason: 'minLength', val: v});
    if (max != null && len > max) return Modifier.error.call(this, {reason: 'maxLength', val: v});
		return v;
	},

  equal: function(v) {
    if (!("value" in this)) {
      return Modifier.error.call(this, {reason: 'noValue', val: v});
    }

    if (this.strict && this.value !== v) {
      return Modifier.error.call(this, {reason: 'notStrictEqual', val: v});
    }
    else if (!this.strict && this.value != v) {
      return Modifier.error.call(this, {reason: 'notEqual', val: v});
    }
    return v;
  },

  isNull: function(v) {
    if ((this.strict && v === null) || (!this.strict && v == null)) return v;
    return Modifier.error.call(this, {reason: 'notNull', val : v});
  },

  isUndefined: function(v) {
    if ((this.strict && v === undefined) || (!this.strict && v == undefined)) return v;
    return Modifier.error.call(this, {reason: 'notUndefined', val : v});
  },

  regex: function(v) {
    if (!("pattern" in this)) {
      return Modifier.error.call(this, {reason: 'noPattern' ,val: v});
    }

    if (! v.toString().match(this.pattern)) return Modifier.error.call(this, {reason: 'notMatch', val : v});
    return v;
  },

  func: function(fn) {
    if (typeof fn != 'function') return Modifier.error.call(this, {reason: 'notFunction', val: fn});
    return fn;
  },

  oneof: function(v) {
    if (this.list instanceof Array && this.list.indexOf(v) < 0) {
      return Modifier.error.call(this, {reason: 'notInList', val: v});
    }
    else if (!this.list) {
      return Modifier.error.call(this, {reason: 'noList', val: v});
    }
    return v;
  },

  /* mapping arguments to the context */

  mappers: {
  // arg[0]        arg[1] arg[2] arg[3] ....
    integer     : ['min', 'max', 'strict'],
    number      : ['min', 'max', 'strict'],
    string      : ['min', 'max', 'strict'],
    equal       : ['value', 'strict'],
    isNull      : ['strict'],
    isUndefined : ['strict'],
    regex       : ['pattern'],
    oneof       : ['list']
  },

  /* filters */

  noerror : function(fn) {
    return function(v) {
      try {
        v = fn(v);
        return v;
      }
      catch (e) {
        return undefined;
      }
    }

  },

  every: function() {
    var args = arguments;
    return function() {
      var vals = arguments;
      Array.prototype.forEach.call(args, function(fn) {
        if (typeof fn == 'function') {
          vals[0] = fn.apply(null, vals);
        }
      });
      return vals[0];
    };
  },

  some: function() {
    var args = arguments;
    return function(v) {
      var errs = [];
      var ret = Array.prototype.some.call(args, function(fn) {
        try {
          v = fn(v);
          return true;
        } catch (e) {
          errs.push(e.message);
          return false;
        }
      });
      if (!ret) return Modifier.error.call(this, {reason: 'noneOf', val : v, errors: errs});
      return v;
    };
  },


  /* modifiers without raising errors */

  numberize: function(v, _default) {
    var vN = Number(v);
    return (isNaN(vN) || v == null || v === false || v == '') ? _default : vN;
  },


  /* methods to enable context chaining */

  bind: function() {
    var key = Array.prototype.shift.call(arguments);
    if (typeof Modifier[key] != 'function') return Modifier.error.call(this, {reason: 'noMethod', val: key});
    var ob = arguments[0];
    if (Modifier.mappers[key] instanceof Array && (ob == null || (typeof ob != 'object') || (ob.constructor != Object))) {
      var context = {};
      Array.prototype.forEach.call(arguments, function(v, k) {
        var arg = Modifier.mappers[key][k];
        if (arg) context[arg] = v;
      });
      return Modifier[key].bind(context);
    }

    return Modifier[key].bind(arguments[0] || {});
  },

  empty: function() {
  },


  /* utilities */

  error : function(info) {
    if (this.quiet) {
      return undefined;
    }
    var e = new Error(info.reason);
    e.reason = info.reason;
    e.val = info.val;
    throw e;
  }
};
Modifier.set = Modifier.bind;
Modifier.where = Modifier.bind;

// for Node.js
if (typeof exports == 'object' && exports === this) {
  var fs  = require('fs');
  var pth = require('path');

  Modifier.mappers.file = ['normalize'];

  Modifier.file = function(path) {
    path = Modifier.string(path);
    try {
      if (!fs.statSync(path).isFile()) {
        return Modifier.error.call(this, {reason: 'notFile.', val : path});
      }
      return (this.normalize) ? pth.normalize(path) : path;
    }
    catch (e) {
      return Modifier.error.call(this, {reason: 'noSuchFileOrDirectory', val: path});
    }
  };

  Modifier.mappers.dir = ['normalize'];
  Modifier.dir = function(path) {
    path = Modifier.string(path);
    try {
      if (!fs.statSync(path).isDirectory()) {
        return Modifier.error.call(this, {reason: 'notDirectory.', val : path});
      }
      return (this.normalize) ? pth.normalize(path) : path;
    }
    catch (e) {
      return Modifier.error.call(this, {reason: 'noSuchFileOrDirectory.', val: path});
    }
  };

  Modifier.mappers.path = ['type', 'normalize'];
  Modifier.path = function(path) {
    switch (this.type) {
    case 'path':
    default: 
      path = Modifier.string(path);
      if (!pth.existsSync(path)) {
        return Modifier.error.call(this, {reason: 'noSuchFileOrDirectory.', val : path});
      }
      return (this.normalize) ? pth.normalize(path) : path;
    case 'file':
      return Modifier.file.call(this, path);
    case 'dir':
      return Modifier.dir.call(this, path);
    }
  };
}

Modifier.empty.prototype = Modifier;

/* extension of each method */
var ModifierExtensions = Object.create(Object.prototype, {
  quiet: {
    get: function() {
      return this.bind({quiet: true});
    },
    set: function(){},
    enumerable: true
  },
  strict: {
    get: function() {
      return this.bind({strict: true});
    },
    set: function(){},
    enumerable: true
  }
});

/* ModifierExtensions inherits Function.prototype */
Object.getOwnPropertyNames(Function.prototype).forEach(function(k) {
  ModifierExtensions[k] = Function.prototype[k];
});

/* ModifierExtensions overrides Function.prototype.bind */
ModifierExtensions.bind = function(obj) {
  if (!this.bound) {
    var boundFunc = Function.prototype.bind.apply(this, arguments);
    Modifier.extend(boundFunc);
    boundFunc.bound = obj;
    return boundFunc;
  }
  else {
    Object.keys(obj).forEach(function(k) {
      this.bound[k] = obj[k];
    }, this);
    return this;
  }
};
ModifierExtensions.set = ModifierExtensions.bind;
ModifierExtensions.where = ModifierExtensions.bind;

Object.freeze(ModifierExtensions);

Modifier.extend = function(fn) {
  if (fn.__proto__) {
    fn.__proto__ = ModifierExtensions;
  }
  else {
    Object.getOwnPropertyNames(ModifierExtensions).forEach(function(p) {
      Object.defineProperty(fn, p, {
        value    : ModifierExtensions[p],
        writable : false
      });
    }, this);
  }
};

Object.keys(Modifier).forEach(function(k) {
  if (typeof Modifier[k] == 'function') {
    Modifier.extend(Modifier[k]);
  }
});

Object.freeze(Modifier);
if (typeof exports === "object" && this === exports) module.exports = Modifier;
