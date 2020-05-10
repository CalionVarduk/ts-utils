import { Queue } from '../../core/collections/queue';
import each from 'jest-each';

test('ctor should create a proper Queue object',
    () =>
    {
        const result = new Queue<number>();

        expect(result.length).toBe(0);
        expect(result.isEmpty).toBe(true);
    }
);

test('first should throw if queue is empty',
    () =>
    {
        const queue = new Queue<number>();

        const action = () => queue.first();

        expect(action).toThrow();
    }
);

test('first should return the item at the front of the queue',
    () =>
    {
        const queue = new Queue<number>();
        queue.push(1);
        queue.push(2);

        const result = queue.first();

        expect(result).toBe(1);
        expect(queue.length).toBe(2);
    }
);

test('tryFirst should return null if queue is empty',
    () =>
    {
        const queue = new Queue<number>();

        const result = queue.tryFirst();

        expect(result).toBeNull();
    }
);

test('tryFirst should return the item at the front of the queue',
    () =>
    {
        const queue = new Queue<number>();
        queue.push(1);
        queue.push(2);

        const result = queue.tryFirst();

        expect(result).toBe(1);
        expect(queue.length).toBe(2);
    }
);

test('last should throw if queue is empty',
    () =>
    {
        const queue = new Queue<number>();

        const action = () => queue.last();

        expect(action).toThrow();
    }
);

test('last should return the item at the end of the queue',
    () =>
    {
        const queue = new Queue<number>();
        queue.push(1);
        queue.push(2);

        const result = queue.last();

        expect(result).toBe(2);
        expect(queue.length).toBe(2);
    }
);

test('tryLast should return null if queue is empty',
    () =>
    {
        const queue = new Queue<number>();

        const result = queue.tryLast();

        expect(result).toBeNull();
    }
);

test('tryLast should return the item at the end of the queue',
    () =>
    {
        const queue = new Queue<number>();
        queue.push(1);
        queue.push(2);

        const result = queue.tryLast();

        expect(result).toBe(2);
        expect(queue.length).toBe(2);
    }
);

test('peekAt should throw if index is negative',
    () =>
    {
        const queue = new Queue<number>();
        queue.push(1);

        const action = () => queue.peekAt(-1);

        expect(action).toThrow();
        expect(queue.length).toBe(1);
    }
);

test('peekAt should throw if index is too large',
    () =>
    {
        const queue = new Queue<number>();
        queue.push(1);
        queue.push(2);

        const action = () => queue.peekAt(2);

        expect(action).toThrow();
        expect(queue.length).toBe(2);
    }
);

each([
    [0, 1],
    [1, 2],
    [2, 3]
])
.test('peekAt should return correct item (#%): index: %f, expected: %f',
    (index: number, expected: number) =>
    {
        const queue = new Queue<number>();
        queue.push(1);
        queue.push(2);
        queue.push(3);

        const result = queue.peekAt(index);

        expect(result).toBe(expected);
        expect(queue.length).toBe(3);
    }
);

test('tryPeekAt should throw if index is negative',
    () =>
    {
        const queue = new Queue<number>();
        queue.push(1);

        const result = queue.tryPeekAt(-1);

        expect(result).toBeNull();
        expect(queue.length).toBe(1);
    }
);

test('tryPeekAt should throw if index is too large',
    () =>
    {
        const queue = new Queue<number>();
        queue.push(1);
        queue.push(2);

        const result = queue.tryPeekAt(2);

        expect(result).toBeNull();
        expect(queue.length).toBe(2);
    }
);

each([
    [0, 1],
    [1, 2],
    [2, 3]
])
.test('tryPeekAt should return correct item (#%): index: %f, expected: %f',
    (index: number, expected: number) =>
    {
        const queue = new Queue<number>();
        queue.push(1);
        queue.push(2);
        queue.push(3);

        const result = queue.tryPeekAt(index);

        expect(result).toBe(expected);
        expect(queue.length).toBe(3);
    }
);

test('push should add first item correctly',
    () =>
    {
        const queue = new Queue<number>();
        queue.push(1);

        expect(queue.length).toBe(1);
        expect(queue.isEmpty).toBe(false);
        expect(queue.first()).toBe(1);
        expect(queue.last()).toBe(1);
    }
);

test('push should add another item correctly',
    () =>
    {
        const queue = new Queue<number>();
        queue.push(1);

        queue.push(2);

        expect(queue.length).toBe(2);
        expect(queue.isEmpty).toBe(false);
        expect(queue.first()).toBe(1);
        expect(queue.last()).toBe(2);
    }
);

test('pop should throw if stack is empty',
    () =>
    {
        const queue = new Queue<number>();

        const action = () => queue.pop();

        expect(action).toThrow();
        expect(queue.length).toBe(0);
    }
);

test('pop should remove last item correctly',
    () =>
    {
        const queue = new Queue<number>();
        queue.push(1);

        const result = queue.pop();

        expect(result).toBe(1);
        expect(queue.length).toBe(0);
        expect(queue.isEmpty).toBe(true);
    }
);

test('pop should remove non-last item correctly',
    () =>
    {
        const queue = new Queue<number>();
        queue.push(1);
        queue.push(2);

        const result = queue.pop();

        expect(result).toBe(1);
        expect(queue.length).toBe(1);
        expect(queue.isEmpty).toBe(false);
        expect(queue.first()).toBe(2);
        expect(queue.last()).toBe(2);
    }
);

test('tryPop should throw if stack is empty',
    () =>
    {
        const queue = new Queue<number>();

        const result = queue.tryPop();

        expect(result).toBeNull();
        expect(queue.length).toBe(0);
    }
);

test('tryPop should remove last item correctly',
    () =>
    {
        const queue = new Queue<number>();
        queue.push(1);

        const result = queue.tryPop();

        expect(result).toBe(1);
        expect(queue.length).toBe(0);
        expect(queue.isEmpty).toBe(true);
    }
);

test('tryPop should remove non-last item correctly',
    () =>
    {
        const queue = new Queue<number>();
        queue.push(1);
        queue.push(2);

        const result = queue.tryPop();

        expect(result).toBe(1);
        expect(queue.length).toBe(1);
        expect(queue.isEmpty).toBe(false);
        expect(queue.first()).toBe(2);
        expect(queue.last()).toBe(2);
    }
);

test('clear should remove all items',
    () =>
    {
        const queue = new Queue<number>();
        queue.push(1);
        queue.push(2);
        queue.push(3);

        queue.clear();

        expect(queue.length).toBe(0);
        expect(queue.isEmpty).toBe(true);
    }
);

test('iterator symbol should return correct iterable',
    () =>
    {
        const queue = new Queue<number>();
        queue.push(1);
        queue.push(2);
        queue.push(3);

        const result = Array.from(queue[Symbol.iterator]());

        expect(result.length).toBe(queue.length);
        expect(result[0]).toBe(1);
        expect(result[1]).toBe(2);
        expect(result[2]).toBe(3);
    }
);

each([
    ['EEE'],
    ['EEDE'],
    ['EEEDDE'],
    ['EEDEE'],
    ['EEDD'],
    ['EED'],
    ['EEDEEE'],
    ['EEEDDED'],
    ['EEEDDEDEEE'],
    ['EEDEEEEDDDDE']
])
.test('queue invariant should be satisfied (%#): test case: %s',
    (testCase: string) =>
    {
        const queue = new Queue<number>();

        let expectedLength = 0;
        let expectedFirst = 0;
        let expectedLast = -1;

        for (let i = 0; i < testCase.length; ++i)
        {
            if (testCase[i] === 'E')
            {
                ++expectedLast;
                ++expectedLength;
                queue.push(expectedLast);
            }
            else if (testCase[i] === 'D')
            {
                ++expectedFirst;
                --expectedLength;
                queue.pop();
            }
        }

        const items = Array.from(queue);
        expect(queue.length).toBe(expectedLength);
        expect(queue.tryFirst()).toBe(expectedLength > 0 ? expectedFirst : null);
        expect(queue.tryLast()).toBe(expectedLength > 0 ? expectedLast : null);
        expect(items.length).toBe(expectedLength);

        for (let i = 0; i < expectedLength; ++i)
            expect(items[i]).toBe(expectedFirst + i);
    }
);
