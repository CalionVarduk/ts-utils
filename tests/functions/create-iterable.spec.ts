import { createIterable } from '../../src/functions/create-iterable';

test('createIterable should return correct result',
    () =>
    {
        const iteratorFactory = function*()
            {
                yield 1;
                yield 2;
                yield 3;
            };

        const result = createIterable(iteratorFactory);
        const elements = Array.from(result);
        const exhaustionTest = Array.from(result);

        expect(result[Symbol.iterator]).toBe(iteratorFactory);
        expect(elements).toEqual([1, 2, 3]);
        expect(exhaustionTest).toEqual(elements);
    }
);
