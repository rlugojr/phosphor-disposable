/*-----------------------------------------------------------------------------
| Copyright (c) 2014-2015, PhosphorJS Contributors
|
| Distributed under the terms of the BSD 3-Clause License.
|
| The full license is in the file LICENSE, distributed with this software.
|----------------------------------------------------------------------------*/
'use strict';

/**
 * An object which implements the disposable pattern.
 */
export
interface IDisposable {
  /**
   * Dispose of the resources held by the object.
   *
   * #### Notes
   * It is generally unsafe to use the object after it is disposed.
   *
   * If an object's `dispose` method is called more than once, all
   * calls made after the first will be a no-op.
   */
  dispose(): void;
}


/**
 * A disposable object which delegates to a callback.
 */
export
class DisposableDelegate implements IDisposable {
  /**
   * Construct a new disposable delegate.
   *
   * @param callback - The callback to invoke when the object is
   *   disposed.
   */
  constructor(callback: () => void) {
    this._callback = callback;
  }

  /**
   * Dispose of the resources held by the object.
   */
  dispose(): void {
    var callback = this._callback;
    this._callback = null;
    if (callback) callback();
  }

  private _callback: () => void;
}


/**
 * An object which manages a collection of disposables.
 *
 * #### Notes
 * Items will be disposed in the order they are added to the set.
 */
export
class DisposableSet implements IDisposable {
  /**
   * Construct a new disposable set.
   *
   * @param items - The initial disposable items for the set.
   */
  constructor(items?: IDisposable[]) {
    if (items) items.forEach(item => this._set.add(item));
  }

  /**
   * Dispose of the resources held by the object.
   */
  dispose(): void {
    var set = this._set;
    this._set = null;
    if (set) set.forEach(item => item.dispose());
  }

  /**
   * Add a disposable item to the set.
   *
   * @param item - The disposable item to add to the set. If the item
   *   is already contained in the set, this is a no-op.
   *
   * #### Notes
   * If the set is already disposed, this will throw an error.
   */
  add(item: IDisposable): void {
    if (!this._set) {
      throw new Error('object is disposed');
    }
    this._set.add(item);
  }

  /**
   * Remove a disposable item from the set.
   *
   * @param item - The disposable item to remove from the set. If the
   *   item does not exist in the set, this is a no-op.
   *
   * #### Notes
   * If the set is already disposed, this will throw an error.
   */
  remove(item: IDisposable): void {
    if (!this._set) {
      throw new Error('object is disposed');
    }
    this._set.delete(item);
  }

  /**
   * Clear all disposable items from the set.
   *
   * #### Notes
   * If the set is already disposed, this will throw an error.
   */
  clear(): void {
    if (!this._set) {
      throw new Error('object is disposed');
    }
    this._set.clear();
  }

  private _set = new Set<IDisposable>();
}
