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

    public constructor(collection?: Iterable<T>)
    {
        this._first = null;
        this._last = null;
        this._length = 0;

        if (!isUndefined(collection))
            for (const obj of collection)
                this.push(obj);
    }

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

    public delete(node: IReadonlyListNode<T>): void
    {
        const listNode = instanceOfCast(ListNode, node);
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

    public insertAfter(obj: T, target: IReadonlyListNode<T>): IReadonlyListNode<T>
    {
        const listTarget = instanceOfCast(ListNode, target);
        if (isNull(listTarget) || listTarget.list !== this)
            throw new Error('node doesn\'t belong to this list');

        const node = new ListNode<T>(this, obj);

        if (listTarget === this._last)
        {
            link(this._last!, listTarget);
            this._last = listTarget;
        }
        else
            insert(node, listTarget, listTarget.next!);

        ++this._length;
        return node;
    }

    public insertBefore(obj: T, target: IReadonlyListNode<T>): IReadonlyListNode<T>
    {
        const listTarget = instanceOfCast(ListNode, target);
        if (isNull(listTarget) || listTarget.list !== this)
            throw new Error('node doesn\'t belong to this list');

        const node = new ListNode<T>(this, obj);

        if (listTarget === this._first)
        {
            link(listTarget, this._first!);
            this._first = listTarget;
        }
        else
            insert(node, listTarget.prev!, listTarget);

        ++this._length;
        return node;
    }

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
