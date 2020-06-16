import { List } from '../../core/collections/list';
import { Nullable } from '../../core/types/nullable';
import { IReadonlyListNode } from '../../core/collections/readonly-list-node.interface';
import { isNull } from '../../core/functions';

class TempNode<T>
    implements
    IReadonlyListNode<T>
{
    public readonly isFirst = true;
    public readonly isLast = true;
    public readonly prev = null;
    public readonly next = null;
    public readonly list = null;
    public constructor(public readonly value: T) {}
}

function assertList<T>(list: List<T>, expected: T[]): void
{
    expect(list.length).toBe(expected.length);

    if (expected.length === 0)
    {
        expect(list.isEmpty).toBe(true);
        expect(list.first).toBeNull();
        expect(list.last).toBeNull();
        return;
    }

    expect(list.isEmpty).toBe(false);

    if (expected.length === 1)
    {
        expect(list.first).not.toBeNull();
        expect(list.last).toBe(list.first);
        expect(list.first!.prev).toBeNull();
        expect(list.first!.next).toBeNull();
        expect(list.first!.isFirst).toBe(true);
        expect(list.first!.isLast).toBe(true);
        expect(list.first!.value).toBe(expected[0]);
        expect((list.first as any).list).toBe(list);
        return;
    }

    expect(list.first).not.toBe(list.last);

    let expectedPrev: Nullable<IReadonlyListNode<T>> = null;
    let current: Nullable<IReadonlyListNode<T>> = list.first;
    let index = 0;

    while (index < list.length)
    {
        expect(current).not.toBeNull();
        expect(current!.prev).toBe(expectedPrev);
        expect(current!.isFirst).toBe(current === list.first);
        expect(current!.isLast).toBe(current === list.last);
        expect(current!.value).toBe(expected[index]);
        expect((current as any).list).toBe(list);

        if (!isNull(expectedPrev))
            expect(expectedPrev!.next).toBe(current);

        expectedPrev = current;
        current = current!.next;
        ++index;
    }
    expect(expectedPrev!.next).toBeNull();
}

function assertRemovedNode<T>(node: IReadonlyListNode<T>, expected: T): void
{
    expect(node.prev).toBeNull();
    expect(node.next).toBeNull();
    expect(node.value).toBe(expected);
    expect((node as any).list).toBeNull();
}

test('ctor should create a proper List object',
    () =>
    {
        const result = new List<number>();

        assertList(result, []);
    }
);

test('ctor should create a proper List object, with initialized collection',
    () =>
    {
        const collection = [1, 2, -3, 4, -5, 6];

        const result = new List<number>(collection);

        assertList(result, collection);
    }
);

test('push should add first element properly',
    () =>
    {
        const value = 10;
        const list = new List<number>();

        const result = list.push(value);

        assertList(list, [value]);
        expect(result).toBe(list.last);
    }
);

test('push should add another element properly',
    () =>
    {
        const firstValue = 0;
        const value = 10;
        const list = new List<number>();
        list.push(firstValue);

        const result = list.push(value);

        assertList(list, [firstValue, value]);
        expect(result).toBe(list.last);
    }
);

test('pop should return null for empty list',
    () =>
    {
        const list = new List<number>();

        const result = list.pop();

        assertList(list, []);
        expect(result).toBeNull();
    }
);

test('pop should return last element for list, with one element',
    () =>
    {
        const value = 10;
        const list = new List<number>();
        const node = list.push(value);

        const result = list.pop();

        assertList(list, []);
        assertRemovedNode(node, value);
        expect(result).toBe(value);
    }
);

test('pop should return last element for list',
    () =>
    {
        const firstValue = 0;
        const value = 10;
        const list = new List<number>();
        list.push(firstValue);
        const node = list.push(value);

        const result = list.pop();

        assertList(list, [firstValue]);
        assertRemovedNode(node, value);
        expect(result).toBe(value);
    }
);

test('unshift should add first element properly',
    () =>
    {
        const value = 10;
        const list = new List<number>();

        const result = list.unshift(value);

        assertList(list, [value]);
        expect(result).toBe(list.first);
    }
);

test('unshift should add another element properly',
    () =>
    {
        const firstValue = 0;
        const value = 10;
        const list = new List<number>();
        list.push(firstValue);

        const result = list.unshift(value);

        assertList(list, [value, firstValue]);
        expect(result).toBe(list.first);
    }
);

test('shift should return null for empty list',
    () =>
    {
        const list = new List<number>();

        const result = list.shift();

        assertList(list, []);
        expect(result).toBeNull();
    }
);

test('shift should return first element for list, with one element',
    () =>
    {
        const value = 10;
        const list = new List<number>();
        const node = list.push(value);

        const result = list.shift();

        assertList(list, []);
        assertRemovedNode(node, value);
        expect(result).toBe(value);
    }
);

test('shift should return first element for list',
    () =>
    {
        const value = 10;
        const secondValue = 0;
        const list = new List<number>();
        const node = list.push(value);
        list.push(secondValue);

        const result = list.shift();

        assertList(list, [secondValue]);
        assertRemovedNode(node, value);
        expect(result).toBe(value);
    }
);

test('delete should throw when node is of wrong type',
    () =>
    {
        const list = new List<number>();
        const node = new TempNode(0);

        const action = () => list.delete(node);

        expect(action).toThrow();
        assertList(list, []);
    }
);

test('delete should throw when node doesn\'t belong to the list',
    () =>
    {
        const list = new List<number>();
        const other = new List<number>();
        const node = other.push(0);

        const action = () => list.delete(node);

        expect(action).toThrow();
        assertList(list, []);
    }
);

test('delete should remove the only element properly',
    () =>
    {
        const value = 10;
        const list = new List<number>();
        const node = list.push(value);

        list.delete(node);

        assertList(list, []);
        assertRemovedNode(node, value);
    }
);

test('delete should remove first element properly',
    () =>
    {
        const value = 10;
        const secondValue = 0;
        const list = new List<number>();
        const node = list.push(value);
        const secondNode = list.push(secondValue);

        list.delete(node);

        assertList(list, [secondValue]);
        assertRemovedNode(node, value);
        expect(list.first).toBe(secondNode);
    }
);

test('delete should remove last element properly',
    () =>
    {
        const value = 10;
        const firstValue = 0;
        const list = new List<number>();
        const firstNode = list.push(firstValue);
        const node = list.push(value);

        list.delete(node);

        assertList(list, [firstValue]);
        assertRemovedNode(node, value);
        expect(list.first).toBe(firstNode);
    }
);

test('delete should remove middle element properly',
    () =>
    {
        const value = 10;
        const firstValue = 0;
        const lastValue = -10;
        const list = new List<number>();
        list.push(firstValue);
        const node = list.push(value);
        list.push(lastValue);

        list.delete(node);

        assertList(list, [firstValue, lastValue]);
        assertRemovedNode(node, value);
    }
);

test('insertAfter should throw when node is of wrong type',
    () =>
    {
        const list = new List<number>();
        const node = new TempNode(0);

        const action = () => list.insertAfter(0, node);

        expect(action).toThrow();
        assertList(list, []);
    }
);

test('insertAfter should throw when node doesn\'t belong to the list',
    () =>
    {
        const list = new List<number>();
        const other = new List<number>();
        const node = other.push(0);

        const action = () => list.insertAfter(0, node);

        expect(action).toThrow();
        assertList(list, []);
    }
);

test('insertAfter should add after last element properly',
    () =>
    {
        const value = 10;
        const lastValue = 0;
        const list = new List<number>();
        list.push(lastValue);

        const node = list.insertAfter(value, list.last!);

        assertList(list, [lastValue, value]);
        expect(list.last).toBe(node);
    }
);

test('insertAfter should add after non-last element properly',
    () =>
    {
        const value = 10;
        const lastValue = 0;
        const firstValue = -10;
        const list = new List<number>();
        list.push(firstValue);
        list.push(lastValue);

        list.insertAfter(value, list.first!);

        assertList(list, [firstValue, value, lastValue]);
    }
);

test('insertBefore should throw when node is of wrong type',
    () =>
    {
        const list = new List<number>();
        const node = new TempNode(0);

        const action = () => list.insertBefore(0, node);

        expect(action).toThrow();
        assertList(list, []);
    }
);

test('insertBefore should throw when node doesn\'t belong to the list',
    () =>
    {
        const list = new List<number>();
        const other = new List<number>();
        const node = other.push(0);

        const action = () => list.insertBefore(0, node);

        expect(action).toThrow();
        assertList(list, []);
    }
);

test('insertBefore should add before first element properly',
    () =>
    {
        const value = 10;
        const firstValue = 0;
        const list = new List<number>();
        list.push(firstValue);

        const node = list.insertBefore(value, list.first!);

        assertList(list, [value, firstValue]);
        expect(list.first).toBe(node);
    }
);

test('insertBefore should add before non-first element properly',
    () =>
    {
        const value = 10;
        const lastValue = 0;
        const firstValue = -10;
        const list = new List<number>();
        list.push(firstValue);
        list.push(lastValue);

        list.insertBefore(value, list.last!);

        assertList(list, [firstValue, value, lastValue]);
    }
);

test('clear should remove all nodes',
    () =>
    {
        const list = new List<number>();
        const node1 = list.push(0);
        const node2 = list.push(1);
        const node3 = list.push(2);

        list.clear();

        assertList(list, []);
        assertRemovedNode(node1, 0);
        assertRemovedNode(node2, 1);
        assertRemovedNode(node3, 2);
    }
);

test('iterator symbol should return a valid iterable',
    () =>
    {
        const list = new List<number>();
        list.push(0);
        list.push(1);
        list.push(2);

        const result = Array.from(list[Symbol.iterator]());

        assertList(list, result);
    }
);
