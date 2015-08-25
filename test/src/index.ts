/*-----------------------------------------------------------------------------
| Copyright (c) 2014-2015, PhosphorJS Contributors
|
| Distributed under the terms of the BSD 3-Clause License.
|
| The full license is in the file LICENSE, distributed with this software.
|----------------------------------------------------------------------------*/
'use strict';

import expect = require('expect.js');

import {
  DisposableDelegate, DisposableSet, IDisposable
} from '../../lib/index';


class TestDisposable implements IDisposable {

  count = 0;

  get isDisposed(): boolean {
    return this.count > 0;
  }

  dispose(): void {
    this.count++;
  }
}


describe('phosphor-disposable', () => {

  describe('DisposableDelegate', () => {

    describe('constructor', () => {

      it('should accept a callback', () => {
        var delegate = new DisposableDelegate(() => { });
        expect(delegate instanceof DisposableDelegate).to.be(true);
      });

    });

    describe('#isDisposed', () => {

      it('should be `false` before object is disposed', () => {
        var delegate = new DisposableDelegate(() => { });
        expect(delegate.isDisposed).to.be(false);
      });

      it('should be `true` after object is disposed', () => {
        var delegate = new DisposableDelegate(() => { });
        delegate.dispose();
        expect(delegate.isDisposed).to.be(true);
      });

      it('should be read-only', () => {
        var delegate = new DisposableDelegate(() => { });
        expect(() => delegate.isDisposed = true).to.throwException();
      });

    });

    describe('#dispose()', () => {

      it('should invoke a callback when disposed', () => {
        var called = false;
        var delegate = new DisposableDelegate(() => called = true);
        expect(called).to.be(false);
        delegate.dispose();
        expect(called).to.be(true);
      });

      it('should ignore multiple calls to `dispose`', () => {
        var count = 0;
        var delegate = new DisposableDelegate(() => count++);
        expect(count).to.be(0);
        delegate.dispose();
        delegate.dispose();
        delegate.dispose();
        expect(count).to.be(1);
      });

    });

  });

  describe('DisposableSet', () => {

    describe('constructor', () => {

      it('should accept no arguments', () => {
        var set = new DisposableSet();
        expect(set instanceof DisposableSet).to.be(true);
      });

      it('should accept an array of disposable items', () => {
        var item1 = new TestDisposable();
        var item2 = new TestDisposable();
        var item3 = new TestDisposable();
        var set = new DisposableSet([item1, item2, item3]);
        expect(set instanceof DisposableSet).to.be(true);
      });

    });

    describe('#isDisposed', () => {

      it('should be `false` before object is disposed', () => {
        var set = new DisposableSet();
        expect(set.isDisposed).to.be(false);
      });

      it('should be `true` after object is disposed', () => {
        var set = new DisposableSet();
        set.dispose();
        expect(set.isDisposed).to.be(true);
      });

      it('should be read-only', () => {
        var set = new DisposableSet();
        expect(() => set.isDisposed = true).to.throwException();
      });

    });

    describe('#dispose()', () => {

      it('should dispose all items in the set', () => {
        var item1 = new TestDisposable();
        var item2 = new TestDisposable();
        var item3 = new TestDisposable();
        var set = new DisposableSet([item1, item2, item3]);
        expect(item1.count).to.be(0);
        expect(item2.count).to.be(0);
        expect(item3.count).to.be(0);
        set.dispose();
        expect(item1.count).to.be(1);
        expect(item2.count).to.be(1);
        expect(item3.count).to.be(1);
      });

      it('should dipose items in the order they were added', () => {
        var values: number[] = [];
        var item1 = new DisposableDelegate(() => values.push(0));
        var item2 = new DisposableDelegate(() => values.push(1));
        var item3 = new DisposableDelegate(() => values.push(2));
        var set = new DisposableSet([item1, item2, item3]);
        expect(values).to.eql([]);
        set.dispose();
        expect(values).to.eql([0, 1, 2]);
      });

      it('should ignore multiple calls to `dispose`', () => {
        var item1 = new TestDisposable();
        var item2 = new TestDisposable();
        var item3 = new TestDisposable();
        var set = new DisposableSet([item1, item2, item3]);
        expect(item1.count).to.be(0);
        expect(item2.count).to.be(0);
        expect(item3.count).to.be(0);
        set.dispose();
        set.dispose();
        set.dispose();
        expect(item1.count).to.be(1);
        expect(item2.count).to.be(1);
        expect(item3.count).to.be(1);
      });

    });

    describe('#add()', () => {

      it('should add items to the set', () => {
        var item1 = new TestDisposable();
        var item2 = new TestDisposable();
        var item3 = new TestDisposable();
        var set = new DisposableSet();
        set.add(item1);
        set.add(item2);
        set.add(item3);
        expect(item1.count).to.be(0);
        expect(item2.count).to.be(0);
        expect(item3.count).to.be(0);
        set.dispose();
        expect(item1.count).to.be(1);
        expect(item2.count).to.be(1);
        expect(item3.count).to.be(1);
      });

      it('should maintain insertion order', () => {
        var values: number[] = [];
        var item1 = new DisposableDelegate(() => values.push(0));
        var item2 = new DisposableDelegate(() => values.push(1));
        var item3 = new DisposableDelegate(() => values.push(2));
        var set = new DisposableSet([item1]);
        set.add(item2);
        set.add(item3);
        expect(values).to.eql([]);
        set.dispose();
        expect(values).to.eql([0, 1, 2]);
      });

      it('should ignore duplicate items', () => {
        var values: number[] = [];
        var item1 = new DisposableDelegate(() => values.push(0));
        var item2 = new DisposableDelegate(() => values.push(1));
        var item3 = new DisposableDelegate(() => values.push(2));
        var set = new DisposableSet([item1]);
        set.add(item2);
        set.add(item3);
        set.add(item3);
        set.add(item2);
        set.add(item1);
        expect(values).to.eql([]);
        set.dispose();
        expect(values).to.eql([0, 1, 2]);
      });

      it('should throw if the set is disposed', () => {
        var item = new TestDisposable();
        var set = new DisposableSet();
        set.dispose();
        expect(() => set.add(item)).to.throwException();
      });

    });

    describe('#remove()', () => {

      it('should remove items from the set', () => {
        var item1 = new TestDisposable();
        var item2 = new TestDisposable();
        var item3 = new TestDisposable();
        var set = new DisposableSet([item1, item2, item3]);
        expect(item1.count).to.be(0);
        expect(item2.count).to.be(0);
        expect(item3.count).to.be(0);
        set.remove(item2);
        set.dispose();
        expect(item1.count).to.be(1);
        expect(item2.count).to.be(0);
        expect(item3.count).to.be(1);
      });

      it('should maintain insertion order', () => {
        var values: number[] = [];
        var item1 = new DisposableDelegate(() => values.push(0));
        var item2 = new DisposableDelegate(() => values.push(1));
        var item3 = new DisposableDelegate(() => values.push(2));
        var set = new DisposableSet([item1, item2, item3]);
        expect(values).to.eql([]);
        set.remove(item1);
        set.dispose();
        expect(values).to.eql([1, 2]);
      });

      it('should ignore missing items', () => {
        var values: number[] = [];
        var item1 = new DisposableDelegate(() => values.push(0));
        var item2 = new DisposableDelegate(() => values.push(1));
        var item3 = new DisposableDelegate(() => values.push(2));
        var set = new DisposableSet([item1, item2]);
        expect(values).to.eql([]);
        set.remove(item3);
        set.dispose();
        expect(values).to.eql([0, 1]);
      });

      it('should throw if the set is disposed', () => {
        var item = new TestDisposable();
        var set = new DisposableSet();
        set.dispose();
        expect(() => set.remove(item)).to.throwException();
      });

    });

    describe('#clear()', () => {

      it('remove all items from the set', () => {
        var item1 = new TestDisposable();
        var item2 = new TestDisposable();
        var item3 = new TestDisposable();
        var set = new DisposableSet([item1, item2, item3]);
        expect(item1.count).to.be(0);
        expect(item2.count).to.be(0);
        expect(item3.count).to.be(0);
        set.clear();
        set.dispose();
        expect(item1.count).to.be(0);
        expect(item2.count).to.be(0);
        expect(item3.count).to.be(0);
      });

      it('should throw if the set is disposed', () => {
        var set = new DisposableSet();
        set.dispose();
        expect(() => set.clear()).to.throwException();
      });

    });

  });

});
