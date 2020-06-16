import { IReadonlyStack } from './readonly-stack.interface';
import { Nullable } from '../types';

/** Represents a stack data structure. */
export class Stack<T>
    implements
    IReadonlyStack<T>
{
    public get length(): number
    {
        return this._items.length;
    }

    public get isEmpty(): boolean
    {
        return this._items.length === 0;
    }

    private readonly _items: T[];

    /**
     * Creates a new, empty Stack object.
     */
    public constructor()
    {
        this._items = [];
    }

    public peek(): T
    {
        if (this.isEmpty)
            throw new Error('stack is empty');

        return this._items[this._items.length - 1];
    }

    public tryPeek(): Nullable<T>
    {
        return this.isEmpty ? null : this._items[this._items.length - 1];
    }

    public peekAt(index: number): T
    {
        if (index < 0 || index >= this._items.length)
            throw new Error(`index is out of range [actual: ${index}, expected between 0 and ${this._items.length - 1}]`);

        return this._items[this._items.length - index - 1];
    }

    public tryPeekAt(index: number): Nullable<T>
    {
        return index < 0 || index >= this._items.length ? null : this._items[this._items.length - index - 1];
    }

    /**
     * Adds an item at the top of the stack.
     * @param item Item to add.
     */
    public push(item: T): void
    {
        this._items.push(item);
    }

    /**
     * Removes an item from the top of the stack and returns it.
     * @throws An `Error`, if the stack is empty.
     * @returns Removed item.
     */
    public pop(): T
    {
        if (this.isEmpty)
            throw new Error('stack is empty');

        return this._items.pop()!;
    }

    /**
     * Removes an item from the top of the stack and returns it.
     * @returns Removed item, or `null`, if the stack is empty.
     */
    public tryPop(): Nullable<T>
    {
        return this.isEmpty ? null : this._items.pop()!;
    }

    /**
     * Removes all items from the stack.
     */
    public clear(): void
    {
        this._items.splice(0, this._items.length);
    }

    public *[Symbol.iterator](): IterableIterator<T>
    {
        for (let i = this._items.length - 1; i >= 0; --i)
            yield this._items[i];
    }
}
