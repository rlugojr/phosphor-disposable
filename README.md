phosphor-disposable
===================

[![Build Status](https://travis-ci.org/phosphorjs/phosphor-disposable.svg)](https://travis-ci.org/phosphorjs/phosphor-disposable?branch=master)
[![Coverage Status](https://coveralls.io/repos/phosphorjs/phosphor-disposable/badge.svg?branch=master&service=github)](https://coveralls.io/github/phosphorjs/phosphor-disposable?branch=master)

This is a module for expressing the disposable object pattern. Two constructors
are included to create disposable delegates and collections of disposables.


<a name='install'></a>Package Install
-------------------------------------

**Prerequisites**
- [node](http://nodejs.org/)

```bash
npm install --save phosphor-disposable
```


Source Build
------------

**Prerequisites**
- [git](http://git-scm.com/)
- [node](http://nodejs.org/)

```bash
git clone https://github.com/phosphorjs/phosphor-disposable.git
cd phosphor-disposable
npm install
```

**Rebuild**
```bash
npm run clean
npm run build
```


Run Tests
---------

Follow the source build instructions first.

```bash
npm test
```


Build Docs
----------

Follow the source build instructions first.

```bash
npm run docs
```

Navigate to `docs/index.html`.


Supported Runtimes
------------------

The runtime versions which are currently *known to work* are listed below.
Earlier versions may also work, but come with no guarantees.

- Node 0.12.7+
- IE 11+
- Firefox 32+
- Chrome 38+


Bundle for the Browser
----------------------

Follow the package install instructions first.

Any bundler that understands how to `require()` files with .js and .css
extensions can be used with this package.


Usage Examples
--------------

**Note:** This module is fully compatible with Node/Babel/ES6/ES5. Simply
omit the type declarations when using a language other than TypeScript.

To test the `phosphor-queue` module in a node interactive shell after the
[installation](#install), open a terminal in your current working directory and
run:

```
node
```

Then import the module into Node with the following command:

```node
> disposable = require('phosphor-disposable');
```

To convert a function into a disposable delegate is straightforward, once the
delegate is created `dispose()` disposes of the delegate and invokes its
callback. The `dispose()` method only works the first time, subsequent calls
will do nothing.

```node
> let delegate = new disposable.DisposableDelegate(() => {
... console.log('disposed');
... });

> delegate.dispose();
disposed

> delegate.dispose();

```

Collections of disposables are created with the `DisposableSet` constructor. An
array of disposable delegates can be passed as argument to the constructor,
individual delegates can also be added to the disposable set by means of the
`add()` method. The `dispose()` method will call the corresponding callback for
each delegate function in the set.

```node
> let d1 = new disposable.DisposableDelegate(() => {
... console.log('one');
... });

> let d2 = new disposable.DisposableDelegate(() => {
... console.log('two');
... });

> let d3 = new disposable.DisposableDelegate(() => {
... console.log('three');
... });

> let set = new disposable.DisposableSet([d1, d2]);

> set.add(d3);

> set.dispose();
one
two
three

> set.dispose();

```

To create custom disposables you have to subclass the `IDisposable` class, as
you can see in the following typescript example:

```typescript
import {
  IDisposable
} from 'phosphor-disposable';

class MyDisposable implements IDisposable {

  constructor(id: string) {
    this._id = id;
  }

  get isDisposed(): boolean {
    return this._id === null;
  }

  dispose(): void {
    if (this._id !== null) {
      console.log(this._id);
      this._id = null;
    }
  }

  private _id: string;
}

let foo = new MyDisposable('foo');
let bar = new MyDisposable('bar');
let baz = new MyDisposable('baz');

let set = new DisposableSet();
set.add(foo);
set.add(bar);
set.add(baz);

set.dispose();  // logs: 'foo', 'bar', 'baz'
set.dispose();  // no-op
```


API
---

[API Docs](http://phosphorjs.github.io/phosphor-disposable/api/)
