import { makeGrouping } from '../../core/collections/grouping';

test('makeGrouping should create a proper Grouping object',
    () =>
    {
        const key = { foo: 'foo' };
        const items = [1, 2, 3];
        const result = makeGrouping(key, items);
        expect(result.key).toBe(key);
        expect(result.items).toBe(items);
    }
);
