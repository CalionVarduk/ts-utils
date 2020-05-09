import { IReadonlyListNode } from './readonly-list-node.interface';
import { Nullable } from '../types/nullable';
import { isNull } from '../functions/is-null';
import { IReadonlyList } from './readonly-list.interface';
import { isUndefined, instanceOfCast } from '../functions';

function link<T>(first: ListNode<T>, second: ListNode<T>): void
{
    first.next = second;
    second.prev = first;
}

function insert<T>(node: ListNode<T>, prev: ListNode<T>, next: ListNode<T>): void
{
    node.next = next;
    node.prev = prev;
    prev.next = node;
    next.prev = node;
}

function unlinkFirst<T>(node: ListNode<T>): ListNode<T>
{
    const next = node.next!;
    next.prev = null;
    node.next = null;
    node.list = null;
    return next;
}

function unlinkLast<T>(node: ListNode<T>): ListNode<T>
{
    const prev = node.prev!;
    prev.next = null;
    node.prev = null;
    node.list = null;
    return prev;
}

function unlink<T>(node: ListNode<T>): void
{
    const prev = node.prev!;
    const next = node.next!;
    prev.next = next;
    next.prev = prev;
    node.next = null;
    node.prev = null;
    node.list = null;
}

class ListNode<T>
    implements
    IReadonlyListNode<T>
{
    public get isFirst(): boolean
    {
        return isNull(this.prev);
    }

    public get isLast(): boolean
    {
        return isNull(this.next);
    }

    public readonly value: T;

    public list: Nullable<IReadonlyList<T>>;
    public prev: Nullable<ListNode<T>>;
    public next: Nullable<ListNode<T>>;

    public constructor(list: IReadonlyList<T>, value: T)
    {
        this.list = list;
        this.value = value;
        this.prev = null;
        this.next = null;
    }
}

/** Represents a linked list data structure. */
export class List<T>
    implements
    IReadonlyList<T>
{
    public get length(): number
    {
        return this._length;
    }

    public get isEmpty(): boolean
    {
        return this._length === 0;
    }

    public get first(): Nullable<IReadonlyListNode<T>>
    {
        return this._first;
    }

    public get last(): Nullable<IReadonlyListNode<T>>
    {
        return this._last;
    }

    private _first: Nullable<ListNode<T>>;
    private _last: Nullable<ListNode<T>>;
    private _length: number;

    /**
     * Creates a new List object.
     * @param collection An optional collection to initialize the list with.
     */
    public constructor(collection?: Iterable<T>)
    {
        this._first = null;
        this._last = null;
        this._length = 0;

        if (!isUndefined(collection))
            for (const obj of collection)
                this.push(obj);
    }

    /**
     * Adds a new node to the end of the list.
     * @param obj New node's value.
     * @returns New node.
     */
    public push(obj: T): IReadonlyListNode<T>
    {
        const node = new ListNode<T>(this, obj);

        if (this.isEmpty)
            this._setFirst(node);
        else
        {
            link(this._last!, node);
            this._last = node;
        }
        ++this._length;
        return node;
    }

    /**
     * Removes the last node from the list and returns its value.
     * @returns Removed node's value, if the list is not empty, otherwise `null`.
     */
    public pop(): Nullable<T>
    {
        if (this.isEmpty)
            return null;

        const result = this._last!.value;

        if (this._length === 1)
            this._deleteLast();
        else
            this._last = unlinkLast(this._last!);

        --this._length;
        return result;
    }

    /**
     * Adds a new node to the start of the list.
     * @param obj New node's value.
     * @returns New node.
     */
    public shift(obj: T): IReadonlyListNode<T>
    {
        const node = new ListNode<T>(this, obj);

        if (this.isEmpty)
            this._setFirst(node);
        else
        {
            link(node, this._first!);
            this._first = node;
        }
        ++this._length;
        return node;
    }

    /**
     * Removes the first node from the list and returns its value.
     * @returns Removed node's value, if the list is not empty, otherwise `null`.
     */
    public unshift(): Nullable<T>
    {
        if (this.isEmpty)
            return null;

        const result = this._first!.value;

        if (this._length === 1)
            this._deleteLast();
        else
            this._first = unlinkFirst(this._first!);

        --this._length;
        return result;
    }

    /**
     * Removes a node from the list.
     * @param node Node to remove.
     * @throws An `Error`, if the `node` doesn't belong to the list.
     */
    public delete(node: IReadonlyListNode<T>): void
    {
        const listNode = instanceOfCast<ListNode<T>>(ListNode, node);
        if (isNull(listNode) || listNode.list !== this)
            throw new Error('node doesn\'t belong to this list');

        if (this._length === 1)
            this._deleteLast();
        else if (listNode === this._first)
            this._first = unlinkFirst(listNode);
        else if (listNode === this._last)
            this._last = unlinkLast(listNode);
        else
            unlink(listNode);

        --this._length;
    }

    /**
     * Inserts a new node to the list after the specified `target` node.
     * @param obj New node's value.
     * @param target Node to insert a new node after.
     * @throws An `Error`, if the `target` node doesn't belong to the list.
     * @returns New node.
     */
    public insertAfter(obj: T, target: IReadonlyListNode<T>): IReadonlyListNode<T>
    {
        const listTarget = instanceOfCast<ListNode<T>>(ListNode, target);
        if (isNull(listTarget) || listTarget.list !== this)
            throw new Error('node doesn\'t belong to this list');

        const node = new ListNode<T>(this, obj);

        if (listTarget === this._last)
        {
            link(this._last!, node);
            this._last = node;
        }
        else
            insert(node, listTarget, listTarget.next!);

        ++this._length;
        return node;
    }

    /**
     * Inserts a new node to the list before the specified `target` node.
     * @param obj New node's value.
     * @param target Node to insert a new node before.
     * @throws An `Error`, if the `target` node doesn't belong to the list.
     * @returns New node.
     */
    public insertBefore(obj: T, target: IReadonlyListNode<T>): IReadonlyListNode<T>
    {
        const listTarget = instanceOfCast<ListNode<T>>(ListNode, target);
        if (isNull(listTarget) || listTarget.list !== this)
            throw new Error('node doesn\'t belong to this list');

        const node = new ListNode<T>(this, obj);

        if (listTarget === this._first)
        {
            link(node, this._first!);
            this._first = node;
        }
        else
            insert(node, listTarget.prev!, listTarget);

        ++this._length;
        return node;
    }

    /**
     * Removes all nodes from the list.
     */
    public clear(): void
    {
        let current = this._first;
        while (!isNull(current))
        {
            const next = current.next;
            current.prev = null;
            current.next = null;
            current.list = null;
            current = next;
        }
        this._first = null;
        this._last = null;
        this._length = 0;
    }

    public* [Symbol.iterator](): IterableIterator<T>
    {
        let current = this._first;
        while (!isNull(current))
        {
            yield current.value;
            current = current.next;
        }
    }

    private _deleteLast(): void
    {
        this._first!.list = null;
        this._first = null;
        this._last = null;
    }

    private _setFirst(node: ListNode<T>): void
    {
        this._first = node;
        this._last = node;
    }
}
