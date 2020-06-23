import { Stack } from '../../src/collections/stack';
import each from 'jest-each';

test('ctor should create a proper Stack object',
    () =>
    {
        const result = new Stack<number>();

        expect(result.length).toBe(0);
        expect(result.isEmpty).toBe(true);
    }
);

test('peek should throw if stack is empty',
    () =>
    {
        const stack = new Stack<number>();

        const action = () => stack.peek();

        expect(action).toThrow();
    }
);

test('peek should return the item on top of the stack',
    () =>
    {
        const stack = new Stack<number>();
        stack.push(1);
        stack.push(2);

        const result = stack.peek();

        expect(result).toBe(2);
        expect(stack.length).toBe(2);
    }
);

test('tryPeek should return null if stack is empty',
    () =>
    {
        const stack = new Stack<number>();

        const result = stack.tryPeek();

        expect(result).toBeNull();
    }
);

test('tryPeek should return the item on top of the stack',
    () =>
    {
        const stack = new Stack<number>();
        stack.push(1);
        stack.push(2);

        const result = stack.tryPeek();

        expect(result).toBe(2);
        expect(stack.length).toBe(2);
    }
);

test('peekAt should throw if index is negative',
    () =>
    {
        const stack = new Stack<number>();
        stack.push(1);

        const action = () => stack.peekAt(-1);

        expect(action).toThrow();
        expect(stack.length).toBe(1);
    }
);

test('peekAt should throw if index is too large',
    () =>
    {
        const stack = new Stack<number>();
        stack.push(1);
        stack.push(2);

        const action = () => stack.peekAt(2);

        expect(action).toThrow();
        expect(stack.length).toBe(2);
    }
);

each([
    [0, 3],
    [1, 2],
    [2, 1]
])
.test('peekAt should return correct item (#%): index: %f, expected: %f',
    (index: number, expected: number) =>
    {
        const stack = new Stack<number>();
        stack.push(1);
        stack.push(2);
        stack.push(3);

        const result = stack.peekAt(index);

        expect(result).toBe(expected);
        expect(stack.length).toBe(3);
    }
);

test('tryPeekAt should return null if index is negative',
    () =>
    {
        const stack = new Stack<number>();
        stack.push(1);

        const result = stack.tryPeekAt(-1);

        expect(result).toBeNull();
        expect(stack.length).toBe(1);
    }
);

test('tryPeekAt should return null if index is too large',
    () =>
    {
        const stack = new Stack<number>();
        stack.push(1);
        stack.push(2);

        const result = stack.tryPeekAt(2);

        expect(result).toBeNull();
        expect(stack.length).toBe(2);
    }
);

each([
    [0, 3],
    [1, 2],
    [2, 1]
])
.test('tryPeekAt should return correct item (#%): index: %f, expected: %f',
    (index: number, expected: number) =>
    {
        const stack = new Stack<number>();
        stack.push(1);
        stack.push(2);
        stack.push(3);

        const result = stack.tryPeekAt(index);

        expect(result).toBe(expected);
        expect(stack.length).toBe(3);
    }
);

test('push should add first item correctly',
    () =>
    {
        const stack = new Stack<number>();
        stack.push(1);

        expect(stack.length).toBe(1);
        expect(stack.isEmpty).toBe(false);
        expect(stack.peek()).toBe(1);
    }
);

test('push should add another item correctly',
    () =>
    {
        const stack = new Stack<number>();
        stack.push(1);

        stack.push(2);

        expect(stack.length).toBe(2);
        expect(stack.isEmpty).toBe(false);
        expect(stack.peek()).toBe(2);
    }
);

test('pop should throw if stack is empty',
    () =>
    {
        const stack = new Stack<number>();

        const action = () => stack.pop();

        expect(action).toThrow();
        expect(stack.length).toBe(0);
    }
);

test('pop should remove last item correctly',
    () =>
    {
        const stack = new Stack<number>();
        stack.push(1);

        const result = stack.pop();

        expect(result).toBe(1);
        expect(stack.length).toBe(0);
        expect(stack.isEmpty).toBe(true);
    }
);

test('pop should remove non-last item correctly',
    () =>
    {
        const stack = new Stack<number>();
        stack.push(1);
        stack.push(2);

        const result = stack.pop();

        expect(result).toBe(2);
        expect(stack.length).toBe(1);
        expect(stack.isEmpty).toBe(false);
        expect(stack.peek()).toBe(1);
    }
);

test('tryPop should return null if stack is empty',
    () =>
    {
        const stack = new Stack<number>();

        const result = stack.tryPop();

        expect(result).toBeNull();
        expect(stack.length).toBe(0);
    }
);

test('tryPop should remove last item correctly',
    () =>
    {
        const stack = new Stack<number>();
        stack.push(1);

        const result = stack.tryPop();

        expect(result).toBe(1);
        expect(stack.length).toBe(0);
        expect(stack.isEmpty).toBe(true);
    }
);

test('tryPop should remove non-last item correctly',
    () =>
    {
        const stack = new Stack<number>();
        stack.push(1);
        stack.push(2);

        const result = stack.tryPop();

        expect(result).toBe(2);
        expect(stack.length).toBe(1);
        expect(stack.isEmpty).toBe(false);
        expect(stack.peek()).toBe(1);
    }
);

test('clear should remove all items',
    () =>
    {
        const stack = new Stack<number>();
        stack.push(1);
        stack.push(2);
        stack.push(3);

        stack.clear();

        expect(stack.length).toBe(0);
        expect(stack.isEmpty).toBe(true);
    }
);

test('iterator symbol should return correct iterable',
    () =>
    {
        const stack = new Stack<number>();
        stack.push(1);
        stack.push(2);
        stack.push(3);

        const result = Array.from(stack[Symbol.iterator]());

        expect(result.length).toBe(stack.length);
        expect(result[0]).toBe(3);
        expect(result[1]).toBe(2);
        expect(result[2]).toBe(1);
    }
);
