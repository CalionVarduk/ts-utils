import { makePair } from '../../core/collections/pair';

test('makePair should create a proper Pair object',
    () =>
    {
        const first = 1;
        const second = { foo: 'foo' };
        const result = makePair(first, second);
        expect(result.first).toBe(first);
        expect(result.second).toBe(second);
    }
);
