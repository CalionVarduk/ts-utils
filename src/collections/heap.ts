import { IReadonlyHeap } from './readonly-heap.interface';
import { Comparer } from '../types/comparer';
import { isDefined } from '../functions';
import { toDeepReadonly } from '../types/deep-readonly';
import { Nullable } from '../types/nullable';

function swap<T>(items: T[], i1: number, i2: number): void
{
    const temp = items[i1];
    items[i1] = items[i2];
    items[i2] = temp;
}

function fixUp<T>(items: T[], comparer: Comparer<T>, index: number): void
{
    let parentIndex = Math.trunc((index - 1) / 2);

    while (index > 0 && comparer(toDeepReadonly(items[index]), toDeepReadonly(items[parentIndex])) < 0)
    {
        swap(items, index, parentIndex);
        index = parentIndex;
        parentIndex = Math.trunc((index - 1) / 2);
    }
}

function fixDown<T>(items: T[], comparer: Comparer<T>, index: number, length: number): void
{
    let leftIndex = (index * 2) + 1;

    while (leftIndex < length)
    {
        const rightIndex = leftIndex + 1;
        let targetIndex = comparer(toDeepReadonly(items[leftIndex]), toDeepReadonly(items[index])) < 0 ? leftIndex : index;

        if (rightIndex < length && comparer(toDeepReadonly(items[rightIndex]), toDeepReadonly(items[targetIndex])) < 0)
            targetIndex = rightIndex;

        if (targetIndex === index)
            break;

        swap(items, index, targetIndex);
        index = targetIndex;
        leftIndex = (index * 2) + 1;
    }
}

function pop<T>(items: T[], comparer: Comparer<T>): T
{
    const result = items[0];
    items[0] = items[items.length - 1];
    items.pop();
    fixDown(items, comparer, 0, items.length);
    return result;
}

function replace<T>(items: T[], comparer: Comparer<T>, item: T): T
{
    const result = items[0];
    items[0] = item;
    fixDown(items, comparer, 0, items.length);
    return result;
}

/** Represents a heap data structure. */
export class Heap<T>
    implements
    IReadonlyHeap<T>
{
    public get length(): number
    {
        return this._items.length;
    }

    public get isEmpty(): boolean
    {
        return this._items.length === 0;
    }

    public readonly comparer: Comparer<T>;

    private readonly _items: T[];

    /**
     * Creates a new Heap object.
     * @param comparer Comparer used during heap operations.
     * @param items Optional collection to heapify.
     */
    public constructor(comparer: Comparer<T>, items?: Iterable<T>)
    {
        this.comparer = comparer;

        if (isDefined(items))
        {
            this._items = Array.from(items);
            for (let i = Math.trunc((this._items.length - 1) / 2); i >= 0; --i)
                fixDown(this._items, this.comparer, i, this._items.length);
        }
        else
            this._items = [];
    }

    public peek(): T
    {
        if (this.isEmpty)
            throw new Error('heap is empty');

        return this._items[0];
    }

    public tryPeek(): Nullable<T>
    {
        return this.isEmpty ? null : this._items[0];
    }

    public sort(): T[]
    {
        const result = [...this._items];
        if (result.length < 2)
            return result;

        const lengthLessOne = this._items.length - 1;

        for (let i = 0; i < lengthLessOne; ++i)
        {
            const targetIndex = result.length - i - 1;
            swap(result, 0, targetIndex);
            fixDown(result, this.comparer, 0, targetIndex);
        }

        let first = 0;
        let last = lengthLessOne;

        while (first < last)
            swap(result, first++, last--);

        return result;
    }

    /**
     * Adds an item to the heap.
     * @param item Item to add.
     */
    public push(item: T): void
    {
        this._items.push(item);
        fixUp(this._items, this.comparer, this._items.length - 1);
    }

    /**
     * Removes an item at the root of the heap and returns it.
     * @throws An `Error`, if the heap is empty.
     * @returns Removed item.
     */
    public pop(): T
    {
        if (this.isEmpty)
            throw new Error('heap is empty');

        return pop(this._items, this.comparer);
    }

    /**
     * Removes an item at the root of the heap and returns it.
     * @returns Removed item, or `null`, if the heap is empty.
     */
    public tryPop(): Nullable<T>
    {
        return this.isEmpty ? null : pop(this._items, this.comparer);
    }

    /**
     * Replaces an item at the root of the heap with another item and returns it.
     * @throws An `Error`, if the heap is empty.
     * @returns Removed item.
     */
    public replace(item: T): T
    {
        if (this.isEmpty)
            throw new Error('heap is empty');

        return replace(this._items, this.comparer, item);
    }

    /**
     * Replaces an item at the root of the heap with another item and returns it.
     * @returns Removed item, or `null`, it the heap is empty.
     */
    public tryReplace(item: T): Nullable<T>
    {
        return this.isEmpty ? null : replace(this._items, this.comparer, item);
    }

    /**
     * Removes all items from the heap.
     */
    public clear(): void
    {
        this._items.splice(0, this._items.length);
    }

    public [Symbol.iterator](): IterableIterator<T>
    {
        return this._items[Symbol.iterator]();
    }
}
