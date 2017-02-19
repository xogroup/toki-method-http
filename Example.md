# Examples

<!-- Auto Table of Contents. Use doctoc: https://github.com/thlorenz/doctoc -->
<!-- START doctoc generated TOC please keep comment here to allow auto update -->

<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Hooking up Foo

```javascript
const Foo = require('foo');
let foo = new Foo();

foo.bar();
```

## Calling the hello method

```javascript
const Foo = require('foo');
let foo = new Foo();

foo.name = 'World';
return foo.hello();
```
