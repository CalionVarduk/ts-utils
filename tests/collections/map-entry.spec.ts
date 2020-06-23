import { makeMapEntry } from '../../src/collections/map-entry';

test('makeMapEntry should create a proper MapEntry object',
    () =>
    {
        const key = { foo: 'foo' };
        const value = { bar: 5 };
        const result = makeMapEntry(key, value);
        expect(result.key).toBe(key);
        expect(result.value).toBe(value);
    }
);
