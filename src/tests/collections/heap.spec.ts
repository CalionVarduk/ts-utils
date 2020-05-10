import { Heap } from '../../core/collections/heap';
import { toDeepReadonly } from '../../core/types/deep-readonly';
import each from 'jest-each';

function assertHeapInvariant<T>(heap: Heap<T>): void
{
    const items = Array.from(heap);
    for (let i = 0; i < items.length; ++i)
    {
        const item = items[i];
        const leftChildIndex = (i * 2) + 1;
        const rightChildIndex = leftChildIndex + 1;

        if (leftChildIndex < items.length)
            expect(heap.comparer(toDeepReadonly(item), toDeepReadonly(items[leftChildIndex]))).toBeLessThanOrEqual(0);

        if (rightChildIndex < items.length)
            expect(heap.comparer(toDeepReadonly(item), toDeepReadonly(items[rightChildIndex]))).toBeLessThanOrEqual(0);
    }
}

test('ctor should create a proper Heap object',
    () =>
    {
        const comparer = (a: number, b: number) => a - b;

        const result = new Heap<number>(comparer);

        expect(result.length).toBe(0);
        expect(result.isEmpty).toBe(true);
        expect(result.comparer).toBe(comparer);
    }
);

test('ctor should create a proper Heap object, with collection to heapify',
    () =>
    {
        const collection: number[] = [6, 3, 7, 2, 1, -5, 3, 1, 6, 7, 12, 14, 13, 0];
        const comparer = (a: number, b: number) => a - b;

        const result = new Heap<number>(comparer, collection);

        expect(result.length).toBe(collection.length);
        expect(result.isEmpty).toBe(false);
        expect(result.comparer).toBe(comparer);
        assertHeapInvariant(result);
    }
);

test('peek should throw if heap is empty',
    () =>
    {
        const heap = new Heap<number>((a, b) => a - b);

        const action = () => heap.peek();

        expect(action).toThrow();
    }
);

test('peek should return the item at the root of the heap',
    () =>
    {
        const heap = new Heap<number>((a, b) => a - b, [2, 1]);

        const result = heap.peek();

        expect(result).toBe(1);
        expect(heap.length).toBe(2);
    }
);

test('tryPeek should return null if heap is empty',
    () =>
    {
        const heap = new Heap<number>((a, b) => a - b);

        const result = heap.tryPeek();

        expect(result).toBeNull();
    }
);

test('tryPeek should return the item at the root of the heap',
    () =>
    {
        const heap = new Heap<number>((a, b) => a - b, [2, 1]);

        const result = heap.tryPeek();

        expect(result).toBe(1);
        expect(heap.length).toBe(2);
    }
);

test('sort should return correct result if heap is empty',
    () =>
    {
        const heap = new Heap<number>((a, b) => a - b);

        const result = heap.sort();

        expect(result).toEqual([]);
        expect(heap.length).toBe(0);
        assertHeapInvariant(heap);
    }
);

test('sort should return correct result if heap has exactly one item',
    () =>
    {
        const heap = new Heap<number>((a, b) => a - b, [1]);

        const result = heap.sort();

        expect(result).toEqual([1]);
        expect(heap.length).toBe(1);
        assertHeapInvariant(heap);
    }
);

each([
    [[1, 2, 3]],
    [[3, 2, 1]],
    [[1, 1, 1]],
    [[5, -5, 7, 4, 1, 7, 3, 4]],
    [[1, 2, 8, 0, 2, 5, 2, 4]],
    [[6, 3, 7, 2, 1, -5, 3, 1, 6, 7, 12, 14, 13, 0]]
])
.test('sort should return correct result (%#): items: %o',
    (items: number[]) =>
    {
        const expected = [...items].sort((a, b) => a - b);
        const heap = new Heap<number>((a, b) => a - b, items);
        const original = Array.from(heap);

        const result = heap.sort();

        expect(result).toEqual(expected);
        expect(heap.length).toBe(items.length);
        expect(Array.from(heap)).toEqual(original);
    }
);

test('push should add first item correctly',
    () =>
    {
        const heap = new Heap<number>((a, b) => a - b);
        heap.push(1);

        expect(heap.length).toBe(1);
        expect(heap.isEmpty).toBe(false);
        expect(heap.peek()).toBe(1);
    }
);

test('push should add another item, that won\'t be at the root, correctly',
    () =>
    {
        const heap = new Heap<number>((a, b) => a - b);
        heap.push(1);

        heap.push(2);

        expect(heap.length).toBe(2);
        expect(heap.isEmpty).toBe(false);
        expect(heap.peek()).toBe(1);
        assertHeapInvariant(heap);
    }
);

test('push should add another item, that will be at the root, correctly',
    () =>
    {
        const heap = new Heap<number>((a, b) => a - b);
        heap.push(1);

        heap.push(0);

        expect(heap.length).toBe(2);
        expect(heap.isEmpty).toBe(false);
        expect(heap.peek()).toBe(0);
        assertHeapInvariant(heap);
    }
);

each([
    [[1, 2, 3]],
    [[3, 2, 1]],
    [[1, 1, 1]],
    [[5, -5, 7, 4, 1, 7, 3, 4]],
    [[1, 2, 8, 0, 2, 5, 2, 4]]
])
.test('push should add items correctly (%#): items: %o',
    (items: number[]) =>
    {
        const heap = new Heap<number>((a, b) => a - b);

        for (const item of items)
            heap.push(item);

        expect(heap.length).toBe(items.length);
        expect(heap.isEmpty).toBe(false);
        assertHeapInvariant(heap);
    }
);

test('pop should throw if heap is empty',
    () =>
    {
        const heap = new Heap<number>((a, b) => a - b);

        const action = () => heap.pop();

        expect(action).toThrow();
        expect(heap.length).toBe(0);
    }
);

test('pop should remove last item correctly',
    () =>
    {
        const heap = new Heap<number>((a, b) => a - b, [1]);

        const result = heap.pop();

        expect(result).toBe(1);
        expect(heap.length).toBe(0);
        expect(heap.isEmpty).toBe(true);
    }
);

test('pop should remove non-last item correctly',
    () =>
    {
        const heap = new Heap<number>((a, b) => a - b, [1, 2]);

        const result = heap.pop();

        expect(result).toBe(1);
        expect(heap.length).toBe(1);
        expect(heap.isEmpty).toBe(false);
        expect(heap.peek()).toBe(2);
    }
);

each([
    [1],
    [2],
    [3],
    [4],
    [5]
])
.test('pop should remove items correctly (%#): count: %f',
    (count: number) =>
    {
        const heap = new Heap<number>((a, b) => a - b, [6, 3, 7, 2, 1, -5, 3, 1, 6, 7, 12, 14, 13, 0]);
        const originalLength = heap.length;

        for (let i = 0; i < count; ++i)
        {
            const expected = heap.peek();
            const result = heap.pop();
            expect(result).toBe(expected);
        }

        expect(heap.length).toBe(originalLength - count);
        expect(heap.isEmpty).toBe(false);
        assertHeapInvariant(heap);
    }
);

test('tryPop should return null if heap is empty',
    () =>
    {
        const heap = new Heap<number>((a, b) => a - b);

        const result = heap.tryPop();

        expect(result).toBeNull();
        expect(heap.length).toBe(0);
    }
);

test('tryPop should remove last item correctly',
    () =>
    {
        const heap = new Heap<number>((a, b) => a - b, [1]);

        const result = heap.tryPop();

        expect(result).toBe(1);
        expect(heap.length).toBe(0);
        expect(heap.isEmpty).toBe(true);
    }
);

test('tryPop should remove non-last item correctly',
    () =>
    {
        const heap = new Heap<number>((a, b) => a - b, [1, 2]);

        const result = heap.tryPop();

        expect(result).toBe(1);
        expect(heap.length).toBe(1);
        expect(heap.isEmpty).toBe(false);
        expect(heap.peek()).toBe(2);
    }
);

each([
    [1],
    [2],
    [3],
    [4],
    [5]
])
.test('tryPop should remove items correctly (%#): count: %f',
    (count: number) =>
    {
        const heap = new Heap<number>((a, b) => a - b, [6, 3, 7, 2, 1, -5, 3, 1, 6, 7, 12, 14, 13, 0]);
        const originalLength = heap.length;

        for (let i = 0; i < count; ++i)
        {
            const expected = heap.peek();
            const result = heap.tryPop();
            expect(result).toBe(expected);
        }

        expect(heap.length).toBe(originalLength - count);
        expect(heap.isEmpty).toBe(false);
        assertHeapInvariant(heap);
    }
);

test('replace should throw if heap is empty',
    () =>
    {
        const heap = new Heap<number>((a, b) => a - b);

        const action = () => heap.replace(0);

        expect(action).toThrow();
        expect(heap.length).toBe(0);
    }
);

test('replace should remove last item and add new item correctly',
    () =>
    {
        const heap = new Heap<number>((a, b) => a - b, [1]);

        const result = heap.replace(0);

        expect(result).toBe(1);
        expect(heap.length).toBe(1);
        expect(heap.isEmpty).toBe(false);
        expect(heap.peek()).toBe(0);
    }
);

test('replace should remove non-last item and add new item correctly',
    () =>
    {
        const heap = new Heap<number>((a, b) => a - b, [1, 2]);

        const result = heap.replace(3);

        expect(result).toBe(1);
        expect(heap.length).toBe(2);
        expect(heap.isEmpty).toBe(false);
        expect(heap.peek()).toBe(2);
    }
);

each([
    [1],
    [2],
    [3],
    [4],
    [5]
])
.test('replace should remove items and new items correctly (%#): count: %f',
    (count: number) =>
    {
        const base = 20;
        const heap = new Heap<number>((a, b) => a - b, [6, 3, 7, 2, 1, -5, 3, 1, 6, 7, 12, 14, 13, 0]);
        const originalLength = heap.length;

        for (let i = 0; i < count; ++i)
        {
            const expected = heap.peek();
            const result = heap.replace(base + i);
            expect(result).toBe(expected);
        }

        expect(heap.length).toBe(originalLength);
        expect(heap.isEmpty).toBe(false);
        assertHeapInvariant(heap);
    }
);

test('tryReplace should return null if heap is empty',
    () =>
    {
        const heap = new Heap<number>((a, b) => a - b);

        const result = heap.tryReplace(0);

        expect(result).toBeNull();
        expect(heap.length).toBe(0);
    }
);

test('tryReplace should remove last item and add new item correctly',
    () =>
    {
        const heap = new Heap<number>((a, b) => a - b, [1]);

        const result = heap.tryReplace(0);

        expect(result).toBe(1);
        expect(heap.length).toBe(1);
        expect(heap.isEmpty).toBe(false);
        expect(heap.peek()).toBe(0);
    }
);

test('tryReplace should remove non-last item and add new item correctly',
    () =>
    {
        const heap = new Heap<number>((a, b) => a - b, [1, 2]);

        const result = heap.tryReplace(3);

        expect(result).toBe(1);
        expect(heap.length).toBe(2);
        expect(heap.isEmpty).toBe(false);
        expect(heap.peek()).toBe(2);
    }
);

each([
    [1],
    [2],
    [3],
    [4],
    [5]
])
.test('tryReplace should remove items and new items correctly (%#): count: %f',
    (count: number) =>
    {
        const base = 20;
        const heap = new Heap<number>((a, b) => a - b, [6, 3, 7, 2, 1, -5, 3, 1, 6, 7, 12, 14, 13, 0]);
        const originalLength = heap.length;

        for (let i = 0; i < count; ++i)
        {
            const expected = heap.peek();
            const result = heap.tryReplace(base + i);
            expect(result).toBe(expected);
        }

        expect(heap.length).toBe(originalLength);
        expect(heap.isEmpty).toBe(false);
        assertHeapInvariant(heap);
    }
);

test('clear should remove all items',
    () =>
    {
        const heap = new Heap<number>((a, b) => a - b, [1, 2, 3]);

        heap.clear();

        expect(heap.length).toBe(0);
        expect(heap.isEmpty).toBe(true);
    }
);

test('iterator symbol should return correct iterable',
    () =>
    {
        const heap = new Heap<number>((a, b) => a - b, [6, 3, 7, 2, 1]);

        const result = Array.from(heap[Symbol.iterator]());

        expect(result.length).toBe(heap.length);
        expect(result).toEqual([1, 2, 7, 6, 3]);
    }
);
