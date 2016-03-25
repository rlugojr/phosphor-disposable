phosphor-disposable
===================

[![Build Status](https://travis-ci.org/phosphorjs/phosphor-disposable.svg)](https://travis-ci.org/phosphorjs/phosphor-disposable?branch=master)
[![Coverage Status](https://coveralls.io/repos/phosphorjs/phosphor-disposable/badge.svg?branch=master&service=github)](https://coveralls.io/github/phosphorjs/phosphor-disposable?branch=master)

A module for expressing the disposable object pattern.


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

Any bundler that understands how to `require()` files with .js extensions
can be used with this package.


Usage Examples
--------------

**Note:** This module is fully compatible with Node/Babel/ES6/ES5. Simply
omit the type declarations when using a language other than TypeScript.

To test the `phosphor-disposable` module in a node interactive shell after the
[installation](#install), open a terminal in your current working directory and
run:

```
node
```

Then import the module into Node with the following command:

```node
> disposable = require('phosphor-disposable');
```

Converting a function into a disposable object is straightforward using the
provided `DisposableDelegate` class. Once the delegate is created, `dispose()`
disposes of the delegate and invokes the callback. The `dispose()` method will
only execute the function the first time, subsequent calls will do nothing.

```node
> let delegate = new disposable.DisposableDelegate(() => {
... console.log('disposed');
... });

> delegate.dispose();
disposed

> delegate.dispose();

```

Collections of disposables are created with the provided `DisposableSet()`
class. An array of disposable objects can be passed as argument to the class
constructor. Individual objects can also be added to the disposable set by
means of the `add()` method. The `dispose()` method will dispose all of the
objects added to the set.

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

Custom disposable objects can be created by implementing `IDisposable`:

```typescript
import {
  IDisposable
} from 'phosphor-disposable';

class MyDisposable implements IDisposable {

  constructor(id: string) {
    this._id = id;
  }

  get isDisposed(): boolean {
    return this._disposed;
  }

  dispose(): void {
    if (!this._disposed) {
      this._disposed = true;
      console.log(this._id);
    }
  }

  private _id: string;
  private _disposed = false;
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
