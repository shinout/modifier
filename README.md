modifier
===========

description
------------
JavaScript validator / modifier
Available in modern browsers and Node.js.

API at a glance
----------------

require

```js
var Modifier = require('modifier'); // in Node.js
```

make it integer

```js
var num = Modifier.integer("10.3");
console.assert(num === 10); // to integer
```

make it number with conditions 

```js
var num2 = Modifier.number.where({ min: 10 })("10.3");
console.assert(num2 === 10.3); // to number, minimum 10
```

match?

```js
var match = Modifier.regex.where({ pattern: /[a-z]/ })("shinout");
console.assert(match === "shinout"); // matched
```

error?

```js
try {
  var int1 = Modifier.integer("xxx");
}
catch (e) {
  // get reason
  console.assert(e.reason === 'NaN');
  console.assert(e.val === 'xxx');
}
```

quiet

```js
var str1 = Modifier.string.where({ quiet: true, min : 4 })("ABC");
console.assert(str1 === undefined);
```

strict

```js
try {
  var str2 = Modifier.string.where({ strict: true })(1324);
}
catch (e) {
  console.assert(e.reason === 'notString');
  console.assert(e.val === 1324);
}
```


modifiers
----------
<table>
<tr>
<th>name</th>
<th>description</th>
<th>example</th>
<th>result</th>
</tr>

<tr>
<th>integer</th>
<td>make values integer</td>
<td>Modifier.integer.where({min: 0})("1.33")</td>
<th>1</th>
</tr>


<tr>
<th>number</th>
<td>numberize values</td>
<td>Modifier.integer.where({max: 10})("8.33")</td>
<th>8.33</th>
</tr>


<tr>
<th>string</th>
<td>stringify values</td>
<td>Modifier.integer.where({min: 4})("shinout")</td>
<th>"shinout"</th>
</tr>


<tr>
<th>bool</th>
<td>make it boolean</td>
<td>Modifier.bool("shinout")</td>
<th>true</th>
</tr>


<tr>
<th>array</th>
<td>check if array or not </td>
<td>Modifier.array.where({max: 4})([1, "foo", -3, 3])</td>
<th>[1, "foo", -3, 3]</th>
</tr>


<tr>
<th>regex</th>
<td>check if given string match with the pattern</td>
<td>Modifier.regex.where({pattern: /[a-z]+/})("foobar")</td>
<th>[1, "foo", -3, 3]</th>
</tr>

<tr>
<th>func</th>
<td>check if function or not</td>
<td>Modifier.func(function(v) {})</td>
<th>function(v) {}</th>
</tr>


<tr>
<th>equal</th>
<td>check equality</td>
<td>Modifier.array.where({value: 45})("45")</td>
<th>"45"</th>
</tr>



<tr>
<th>equal</th>
<td>check equality (strict)</td>
<td>Modifier.array.where({value: "45", strict: true})("45")</td>
<th>"45"</th>
</tr>


<tr>
<th>isNull</th>
<td>check if null or not</td>
<td>Modifier.isNull(undefined)</td>
<th>undefined</th>
</tr>


<tr>
<th>isUndefined</th>
<td>check if undefined or not</td>
<td>Modifier.isUndefined(null)</td>
<th>null</th>
</tr>



<tr>
<th>oneof</th>
<td>check the value is in the list</td>
<td>Modifier.oneof.where({list: ["apple", "banana", "microsoft"]})("banana")</td>
<th>"banana"</th>
</tr>


</table>


wheres
------
<table>
<tr>
<th>modifier</th>
<th>key</th>
<th>description</th>
<th>example</th>
<th>related error reason</th>
</tr>

<tr>
<th>(all types)</th>
<th>quiet</th>
<td>throw no errors</td>
<td>fn = Modifier.integer.where({quiet: true})</td>
<td></td>
</tr>

<tr>
<th>integer</th>
<th>min</th>
<td>minimum allowable value</td>
<td>fn = Modifier.integer.where({min: 10})</td>
<td>min</td>
</tr>

<tr>
<th>integer</th>
<th>max</th>
<td>maximum allowable value</td>
<td>fn = Modifier.integer.where({max: 14})</td>
<td>min</td>
</tr>

<tr>
<th>integer</th>
<th>strict</th>
<td>type checking before cast</td>
<td>fn = Modifier.integer.where({strict: true})</td>
<td>notNumber</td>
</tr>

<tr>
<th>number</th>
<th>min</th>
<td>minimum allowable value</td>
<td>fn = Modifier.number.where({min: 10.33})</td>
<td>min</td>
</tr>

<tr>
<th>number</th>
<th>max</th>
<td>maximum allowable value</td>
<td>fn = Modifier.number.where({max: 0.99})</td>
<td>min</td>
</tr>

<tr>
<th>number</th>
<th>strict</th>
<td>type checking before cast</td>
<td>fn = Modifier.number.where({strict: true})</td>
<td>notNumber</td>
</tr>

<tr>
<th>string</th>
<th>trim</th>
<td>trim spaces</td>
<td>fn = Modifier.string.where({trim: true})</td>
<td>-</td>
</tr>

<tr>
<th>string</th>
<th>min</th>
<td>minimum allowable length</td>
<td>fn = Modifier.string.where({min: 7})</td>
<td>minLength</td>
</tr>

<tr>
<th>string</th>
<th>max</th>
<td>maximum allowable length</td>
<td>fn = Modifier.string.where({max: 7})</td>
<td>maxLength</td>
</tr>

<tr>
<th>string</th>
<th>strict</th>
<td>type checking before cast</td>
<td>fn = Modifier.string.where({strict: true})</td>
<td>notString</td>
</tr>

<tr>
<th>array</th>
<th>min</th>
<td>minimum allowable length</td>
<td>fn = Modifier.array.where({min: 7})</td>
<td>minLength</td>
</tr>

<tr>
<th>array</th>
<th>max</th>
<td>maximum allowable length</td>
<td>fn = Modifier.array.where({max: 7})</td>
<td>maxLength</td>
</tr>

<tr>
<th>bool</th>
<th>zerostr</th>
<td>make "0" false</td>
<td>fn = Modifier.bool.where({zerostr: true})</td>
<td>-</td>
</tr>

<tr>
<th>bool</th>
<th>strict</th>
<td>type checking before cast</td>
<td>fn = Modifier.bool.where({strict: true})</td>
<td>notBool</td>
</tr>

<tr>
<th>equal</th>
<th>value</th>
<td>the value to compare with</td>
<td>fn = Modifier.equal.where({value: "xxx"})</td>
<td>notEqual</td>
</tr>

<tr>
<th>equal</th>
<th>strict</th>
<td>===</td>
<td>fn = Modifier.equal.where({value: 1984, strict: true})</td>
<td>notStrictEqual</td>
</tr>

<tr>
<th>isNull</th>
<th>strict</th>
<td>undefined !== null</td>
<td>fn = Modifier.isNull.where({strict: true})</td>
<td>notNull</td>
</tr>

<tr>
<th>isUndefined</th>
<th>strict</th>
<td>undefined !== null</td>
<td>fn = Modifier.isUndefined.where({strict: true})</td>
<td>notUndefined</td>
</tr>

<tr>
<th>regex</th>
<th>pattern</th>
<td>pattern of the regular expression</td>
<td>fn = Modifier.regex.where({pattern: /http(s):\/\//})</td>
<td>notMatch</td>
</tr>

<tr>
<th>oneof</th>
<th>list</th>
<td>list of the choices</td>
<td>fn = Modifier.oneof.where({list: [1,2,3]})</td>
<td>notInList</td>
</tr>

</table>



error reasons
-------------
<table>
<tr>
<th>reason name</th>
<th>from</th>
<th>description</th>
<th>example</th>
</tr>

<tr>
<th>notNumber</th>
<td>number, integer</td>
<td>type of the value is not number</td>
<td>Modifier.number.where({strict: true})("123")</td>
</tr>

<tr>
<th>NaN</th>
<td>number, integer</td>
<td>the value is NaN after casting</td>
<td>Modifier.number("xxx")</td>
</tr>

<tr>
<th>min</th>
<td>number, integer</td>
<td>the value is less than "min" value</td>
<td>Modifier.number.where({min: 3})(2)</td>
</tr>


<tr>
<th>max</th>
<td>number, integer</td>
<td>the value is greater than "max" value</td>
<td>Modifier.integer.where({max: 3})(5)</td>
</tr>


<tr>
<th>notString</th>
<td>string</td>
<td>type of the value is not string</td>
<td>Modifier.string.where({strict: true})(1999)</td>
</tr>


<tr>
<th>minLength</th>
<td>string, array</td>
<td>the length of the value is less than "min" value</td>
<td>Modifier.string.where({min : 5})("Shin")</td>
</tr>


<tr>
<th>maxLength</th>
<td>string, array</td>
<td>the length of the value is larger than "max" value</td>
<td>Modifier.array.where({max : 2})(["A", "B", "C"])</td>
</tr>


<tr>
<th>notBool</th>
<td>bool</td>
<td>type of the value is not boolean</td>
<td>Modifier.bool.where({strict: true})("TRUE")</td>
</tr>


<tr>
<th>notArray</th>
<td>array</td>
<td>type of the value is not array</td>
<td>Modifier.array("aaaaaa")</td>
</tr>


<tr>
<th>notEqual</th>
<td>equal</td>
<td>the value is not equal to the given value</td>
<td>Modifier.equal.where({value: "shinout"})("xxxxxxx")</td>
</tr>

<tr>
<th>notStrictEqual</th>
<td>equal</td>
<td>the value is not strictly equal to the given value</td>
<td>Modifier.equal.where({value: 123})("123")</td>
</tr>


<tr>
<th>notNull</th>
<td>isNull</td>
<td>the value is not null</td>
<td>Modifier.isNull("OK")</td>
</tr>


<tr>
<th>notUndefined</th>
<td>isNull</td>
<td>the value is not undefined</td>
<td>Modifier.isUndefined("OK")</td>
</tr>


<tr>
<th>notMatch</th>
<td>regex</td>
<td>the value does not match the pattern</td>
<td>Modifier.regex.where({pattern: /[a-zA-Z]+/})("shinout310")</td>
</tr>


<tr>
<th>notFunction</th>
<td>func</td>
<td>type of the value is not function</td>
<td>Modifier.func("aaaa")</td>
</tr>


<tr>
<th>notInList</th>
<td>oneof</td>
<td>the value is not in the given list</td>
<td>Modifier.oneof.where({list: [3,4,5]})(1)</td>
</tr>

<tr>
<th>noList</th>
<td>oneof</td>
<td>list is not given</td>
<td>Modifier.oneof(1)</td>
</tr>
</table>



complex coditions
-----------------

**Modifier.some(fn1, fn2, ...)**

```js
Modifier.some(
  Modifier.string,
  Modifier.regex.where({pattern: /^get[A-Za-z0-9]+$/})
)('getConfig##')
```

{reason: "noneOf"} is thrown when none of the modifier match.

**Modifier.every(fn1, fn2, ...)**

```js
Modifier.every(
  Modifier.string,
  Modifier.regex.where({pattern: /^get[A-Za-z0-9]+$/})
)('getConfig')
```

only Node.js
------------

**file**

```js
Modifier.file.where({normalize: true})("/home/shinout/node_modules/jsrel/jsrel.js")
```

- **normalize** can be used to normalize the path.
- **notFile** is the reason when it exists but not a file.
- **noSuchFileOrDirectory** is the reason when no such file or directory.



**dir**

```js
Modifier.dir.where({normalize: true})("/home/shinout/node_modules/jsrel/")
```

- **normalize** can be used to normalize the path.
- **notDirectory** is the reason when it exists but not a directory.
- **noSuchFileOrDirectory** is the reason when no such file or directory.


**path**

```js
Modifier.path.where({normalize: true})("/home/shinout/node_modules/jsrel/")
```

- **normalize** can be used to normalize the path.
- **noSuchFileOrDirectory** is the reason when no such file or directory.




shortcut
---------

- **quiet** can be used like

```js
var fn = Modifier.integer.where({min: 0}).quiet // the same as {quiet: true}

var a = fn(-3); // undefined, throwing no error
```


- **strict** can be used like
```js
var fn = Modifier.integer.where({min: 0}).strict.quiet
```
