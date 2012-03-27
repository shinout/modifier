var vows = require('vows');
var assert = require('assert');
var Modifier = require('../Modifier');

vows.describe('== TESTING Modifier ==').addBatch({
  "Modifier.integer": {
    topic: function() { return Modifier.integer },

    "string number is cast" : function(fn) {
      assert.strictEqual(1192, fn("1192"));
    },

    "string number is not allowed with strict" : function(fn) {
      try {
        fn.strict("1192");
      }
      catch (e) {
        assert.equal(e.reason, "notNumber");
        assert.equal(e.val, "1192");
      }
    },

    "equal to min is allowed" : function(fn) {
      assert.strictEqual(3, fn.where({min: 3, max: 4})("3"));
    },

    "equal to max is allowed" : function(fn) {
      assert.strictEqual(4, fn.where({min: 3, max: 4})("4"));
    },

    "round" : function(fn) {
      assert.strictEqual(3, fn.where({min: 3, max: 4})(3.33));
    },

    "min error" : function(fn) {
      try {
        fn.where({min: 3, max: 4})(2.33);
        throw 1;
      }
      catch (e) {
        assert.equal(e.reason, "min");
        assert.equal(e.val, 2.33);
      }
    },

    "rounded and no error" : function(fn) {
      assert.strictEqual(4, fn.where({min: 3, max: 4})(4.33));
    },

    "max error" : function(fn) {
      try {
        fn.where({min: 3, max: 4})(5.33);
        throw 1;
      }
      catch (e) {
        assert.equal(e.reason, "max");
        assert.equal(e.val, 5.33);
      }
    },

    "quiet" : function(fn) {
      assert.isUndefined(fn.where({min: 3, max: 4}).quiet(6.33));
    },
  },

  "Modifier.number": {
    topic: function() { return Modifier.number },

    "string number is cast" : function(fn) {
      assert.strictEqual(1192, fn("1192"));
    },

    "string number is not allowed with strict" : function(fn) {
      try {
        fn.strict("1192");
      }
      catch (e) {
        assert.equal(e.reason, "notNumber");
        assert.equal(e.val, "1192");
      }
    },

    "equal to min is allowed" : function(fn) {
      assert.strictEqual(3, fn.where({min: 3, max: 4})("3"));
    },

    "equal to max is allowed" : function(fn) {
      assert.strictEqual(4, fn.where({min: 3, max: 4})("4"));
    },

    "not rounded" : function(fn) {
      assert.strictEqual(3.33, fn.where({min: 3, max: 4})(3.33));
    },

    "min error" : function(fn) {
      try {
        fn.where({min: 3, max: 4})(2.33);
        throw 1;
      }
      catch (e) {
        assert.equal(e.reason, "min");
        assert.equal(e.val, 2.33);
      }
    },

    "max error" : function(fn) {
      try {
        fn.where({min: 3, max: 4})(5.33);
        throw 1;
      }
      catch (e) {
        assert.equal(e.reason, "max");
        assert.equal(e.val, 5.33);
      }
    },

    "quiet" : function(fn) {
      assert.isUndefined(fn.where({min: 3, max: 4}).quiet(6.33));
    },
  },





  "Modifier.string": {
    topic: function() { return Modifier.string },

    "number is cast" : function(fn) {
      assert.strictEqual("1192", fn(1192));
    },

    "number is not allowed with strict" : function(fn) {
      try {
        fn.strict(1192);
      }
      catch (e) {
        assert.equal(e.reason, "notString");
        assert.equal(e.val, 1192);
      }
    },

    "object is cast" : function(fn) {
      assert.equal("[object Object]", fn({shinout: "hoge"}));
    },

    "equal to min length is allowed" : function(fn) {
      assert.strictEqual("ABC", fn.where({min: 3, max: 4})("ABC"));
    },

    "equal to max is allowed" : function(fn) {
      assert.strictEqual("zxvf", fn.where({min: 3, max: 4})("zxvf"));
    },

    "min error" : function(fn) {
      try {
        fn.where({min: 3, max: 4})("sh");
        throw 1;
      }
      catch (e) {
        assert.equal(e.reason, "minLength");
        assert.equal(e.val, "sh");
      }
    },

    "max error" : function(fn) {
      try {
        fn.where({min: 3, max: 4})("shinout");
        throw 1;
      }
      catch (e) {
        assert.equal(e.reason, "maxLength");
        assert.equal(e.val, "shinout");
      }
    },

    "quiet" : function(fn) {
      assert.isUndefined(fn.where({min: 3, max: 4}).quiet("aaaaaaa"));
    },
  },




  "Modifier.bool": {
    topic: function() { return Modifier.bool },

    "number is cast" : function(fn) {
      assert.isTrue(fn(1192));
    },

    "string is cast" : function(fn) {
      assert.isTrue(fn("PM"));
    },

    "object is cast" : function(fn) {
      assert.isTrue(fn({a: "b"}));
    },

    "empty object is true" : function(fn) {
      assert.isTrue(fn({}));
    },

    "array is cast" : function(fn) {
      assert.isTrue(fn([1,2]));
    },

    "empty array is true" : function(fn) {
      assert.isTrue(fn([]));
    },

    "string is not allowed with strict" : function(fn) {
      try {
        fn.strict("1192");
      }
      catch (e) {
        assert.equal(e.reason, "notBool");
        assert.equal(e.val, "1192");
      }
    },

    "undefined is false" : function(fn) {
      assert.isFalse(fn(undefined));
    },

    "null is false" : function(fn) {
      assert.isFalse(fn(null));
    },

    "0 is false" : function(fn) {
      assert.isFalse(fn(0));
    },

    "'' is false" : function(fn) {
      assert.isFalse(fn(''));
    },

    "'0' is true" : function(fn) {
      assert.isTrue(fn('0'));
    },

    "'0' is false if zerostr is given" : function(fn) {
      assert.isFalse(fn.where({zerostr: true})('0'));
    },

    "quiet" : function(fn) {
      assert.isUndefined(fn.strict.quiet("aaaaaaa"));
    },
  },





  "Modifier.array": {
    topic: function() { return Modifier.array },

    "object is not an array" : function(fn) {
      try {
        fn({a: "b"});
      }
      catch (e) {
        assert.equal(e.reason, "notArray");
      }
    },

    "quiet" : function(fn) {
      assert.isUndefined(fn.quiet("aaaaaaa"));
    },

    "equal to min length is allowed" : function(fn) {
      assert.lengthOf(fn.where({min: 3, max: 4})([1,2,3]), 3);
    },

    "equal to max is allowed" : function(fn) {
      assert.lengthOf(fn.where({min: 3, max: 4})([4,5,6,6]), 4);
    },

    "min error" : function(fn) {
      try {
        fn.where({min: 3, max: 4})([1,2]);
        throw 1;
      }
      catch (e) {
        assert.equal(e.reason, "minLength");
      }
    },

    "max error" : function(fn) {
      try {
        fn.where({min: 3, max: 4})([3,3,3,3,3,3]);
        throw 1;
      }
      catch (e) {
        assert.equal(e.reason, "maxLength");
      }
    },

  },



  "Modifier.equal": {
    topic: function() { return Modifier.equal },

    "number is cast" : function(fn) {
      assert.strictEqual("3", fn.where({value: 3})("3"));
    },

    "no value" : function(fn) {
      try {
        fn("aaaaaaa");
        throw 1;
      }
      catch (e) {
        assert.equal(e.reason, "noValue");
      }
    },

    "strict equal" : function(fn) {
      try {
        fn.where({value: 1222}).strict("1222");
        throw 1;
      }
      catch (e) {
        assert.equal(e.reason, "notStrictEqual");
      }
    },

    "quiet" : function(fn) {
      var und = fn.where({value: "dd"}).quiet("aaaaaaa");
      assert.isUndefined(und);
    },
  },



  "Modifier.isNull": {
    topic: function() { return Modifier.isNull },

    "0 is not null" : function(fn) {
      try {
        fn(0);
        throw 1;
      }
      catch (e) {
        assert.equal(e.reason, "notNull");
      }
    },

    "'' is not null" : function(fn) {
      try {
        fn('');
        throw 1;
      }
      catch (e) {
        assert.equal(e.reason, "notNull");
      }
    },

    "undefined is null" : function(fn) {
      assert.isUndefined(fn(undefined));
    },

    "undefined is not null" : function(fn) {
      try {
        fn.strict(undefined);
        throw 1;
      }
      catch (e) {
        assert.equal(e.reason, "notNull");
      }
    },

    "quiet" : function(fn) {
      assert.isUndefined(fn.quiet(444));
    },

  },


  "Modifier.isUndefined": {
    topic: function() { return Modifier.isUndefined },

    "0 is not undefined" : function(fn) {
      try {
        fn(0);
        throw 1;
      }
      catch (e) {
        assert.equal(e.reason, "notUndefined");
      }
    },

    "'' is not undefined" : function(fn) {
      try {
        fn('');
        throw 1;
      }
      catch (e) {
        assert.equal(e.reason, "notUndefined");
      }
    },

    "null is undefined" : function(fn) {
      assert.isNull(fn(null));
    },

    "null is not undefined" : function(fn) {
      try {
        fn.strict(null);
        throw 1;
      }
      catch (e) {
        assert.equal(e.reason, "notUndefined");
      }
    },

    "quiet" : function(fn) {
      assert.isUndefined(fn.quiet(444));
    },

  },



  "Modifier.func": {
    topic: function() { return Modifier.func },

    "not func" : function(fn) {
      try {
        fn("aaa");
        throw 1;
      }
      catch (e) {
        assert.equal(e.reason, "notFunction");
      }
    },

    "quiet" : function(fn) {
      assert.isUndefined(fn.quiet(444));
    },
  },



  "Modifier.regex": {
    topic: function() { return Modifier.regex },

    "no pattern" : function(fn) {
      try {
        fn("aaa");
        throw 1;
      }
      catch (e) {
        assert.equal(e.reason, "noPattern");
      }
    },

    "match" : function(fn) {
      assert.equal("shin@shinout.net", fn.where({pattern: /^[A-Za-z0-9]+[\w-]+@[\w\.-]+\.\w{2,}$/})("shin@shinout.net"));
    },

    "not match" : function(fn) {
      try {
        fn.where({pattern: /[0-9]+/})("aaa");
        throw 1;
      }
      catch (e) {
        assert.equal(e.reason, "notMatch");
      }
    },

    "quiet" : function(fn) {
      assert.isUndefined(fn.quiet(444));
    },
  },



  "Modifier.oneof": {
    topic: function() { return Modifier.oneof },

    "noList" : function(fn) {
      try {
        fn("aaa");
        throw 1;
      }
      catch (e) {
        assert.equal(e.reason, "noList");
      }
    },

    "not in list" : function(fn) {
      try {
        fn.where({list: [1,2,3]})("4");
        throw 1;
      }
      catch (e) {
        assert.equal(e.reason, "notInList");
      }
    },

    "not in list (strictly evaluated)" : function(fn) {
      try {
        fn.where({list: [1,2,3]})("3");
        throw 1;
      }
      catch (e) {
        assert.equal(e.reason, "notInList");
      }
    },

    "in list" : function(fn) {
      assert.equal(3, fn.where({list: [1,2,3]})(3));
    },

    "quiet" : function(fn) {
      assert.isUndefined(fn.quiet(444));
    },


  },



  "Modifier.every": {
    topic: function() { return Modifier.every },

    "OK" : function(fn) {
      var a = fn(Modifier.number, Modifier.integer)("33.3");
      assert.strictEqual(33, a);
    },

    "NG" : function(fn) {
      try {
        var a = fn(Modifier.number, Modifier.integer)("33.3kkk");
      }
      catch (e) {
        assert.equal(e.reason, "NaN");
      }
    },

  },


  "Modifier.some": {
    topic: function() { return Modifier.some },

    "OK" : function(fn) {
      var a = fn(Modifier.number, Modifier.string)("33.3");
      assert.strictEqual(33.3, a);
    },

    "NG" : function(fn) {
      try {
        var a = fn(Modifier.number, Modifier.integer)("33.3kkk");
      }
      catch (e) {
        assert.equal(e.reason, "NaN");
      }
    },
  },


}).export(module);
