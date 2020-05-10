import { IReadonlyQueue } from './readonly-queue.interface';
import { Undefinable } from '../types/undefinable';
import { Nullable } from '../types/nullable';

function at<T>(items: Undefinable<T>[], first: number, i: number): T
{
    i = first + i;
    if (i >= items.length)
        i -= items.length;

    return items[i]!;
}

function increaseIndex<T>(items: Undefinable<T>[], i: number): number
{
    return i === items.length - 1 ? 0 : i + 1;
}

/** Represents a queue data structure. */
export class Queue<T>
    implements
    IReadonlyQueue<T>
{
    public get length(): number
    {
        return this._items.length - this._offset;
    }

    public get isEmpty(): boolean
    {
        return this.length === 0;
    }

    private readonly _items: Undefinable<T>[];
    private _firstIndex: number;
    private _lastIndex: number;
    private _offset: number;

    /**
     * Creates a new, empty Queue object.
     */
    public constructor()
    {
        this._items = [];
        this._firstIndex = 0;
        this._lastIndex = -1;
        this._offset = 0;
    }

    public first(): T
    {
        if (this.isEmpty)
            throw new Error('queue is empty');

        return this._items[this._firstIndex]!;
    }

    public tryFirst(): Nullable<T>
    {
        return this.isEmpty ? null : this._items[this._firstIndex]!;
    }

    public last(): T
    {
        if (this.isEmpty)
            throw new Error('queue is empty');

        return this._items[this._lastIndex]!;
    }

    public tryLast(): Nullable<T>
    {
        return this.isEmpty ? null : this._items[this._lastIndex]!;
    }

    public peekAt(index: number): T
    {
        if (index < 0 || index >= this.length)
            throw new Error(`index is out of range [actual: ${index}, expected between 0 and ${this.length - 1}]`);

        return at(this._items, this._firstIndex, index);
    }

    public tryPeekAt(index: number): Nullable<T>
    {
        return index < 0 || index >= this.length ? null : at(this._items, this._firstIndex, index);
    }

    /**
     * Adds an item at the end of the queue.
     * @param item Item to add.
     */
    public push(item: T): void
    {
        if (this._offset === 0)
        {
            if (this._firstIndex === 0)
            {
                this._items.push(item);
                ++this._lastIndex;
            }
            else
            {
                const oldLength = this._items.length;
                this._items.length = oldLength * 2;

                for (let i = this._firstIndex; i < oldLength; ++i)
                    this._items[i + oldLength] = this._items[i];

                this._items[this._firstIndex] = item;

                this._firstIndex += oldLength;
                ++this._lastIndex;
                this._offset = oldLength - 1;
            }
        }
        else
        {
            --this._offset;
            this._lastIndex = increaseIndex(this._items, this._lastIndex);
            this._items[this._lastIndex] = item;
        }
    }

    /**
     * Removes an item from the front of the queue and returns it.
     * @throws An `Error`, if the queue is empty.
     * @returns Removed item.
     */
    public pop(): T
    {
        if (this.isEmpty)
            throw new Error('queue is empty');

        const result = this._items[this._firstIndex];

        if (++this._offset === this._items.length)
            this.clear();
        else
        {
            this._items[this._firstIndex] = void(0);
            this._firstIndex = increaseIndex(this._items, this._firstIndex);
        }
        return result!;
    }

    /**
     * Removes an item from the front of the queue and returns it.
     * @returns Removed item, or `null`, if the queue is empty.
     */
    public tryPop(): Nullable<T>
    {
        if (this.isEmpty)
            return null;

        const result = this._items[this._firstIndex];

        if (++this._offset === this._items.length)
            this.clear();
        else
        {
            this._items[this._firstIndex] = void(0);
            this._firstIndex = increaseIndex(this._items, this._firstIndex);
        }
        return result!;
    }

    /**
     * Removes all items from the queue.
     */
    public clear(): void
    {
        this._items.splice(0, this._items.length);
        this._firstIndex = 0;
        this._lastIndex = -1;
        this._offset = 0;
    }

    public *[Symbol.iterator](): IterableIterator<T>
    {
        const length = this.length;
        for (let i = 0; i < length; ++i)
            yield at(this._items, this._firstIndex, i);
    }
}
