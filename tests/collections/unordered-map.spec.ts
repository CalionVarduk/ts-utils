import { UnorderedMap } from '../../src/collections/unordered-map';

type Complex =
{
    foo: number;
    bar: string;
};

test('ctor should create a proper UnorderedMap object',
    () =>
    {
        const result = new UnorderedMap<number, string>();

        expect(result.length).toBe(0);
        expect(result.isEmpty).toBe(true);
        expect(result.stringifier).toBeTruthy();
    }
);

test('ctor should create a proper UnorderedMap object, with custom stringifier',
    () =>
    {
        const stringifier = (n: number) => (n + 1).toString();

        const result = new UnorderedMap<number, string>(stringifier);

        expect(result.length).toBe(0);
        expect(result.isEmpty).toBe(true);
        expect(result.stringifier).toBe(stringifier);
    }
);

test('get should throw an error, when key doesn\'t exist',
    () =>
    {
        const key = 0;
        const map = new UnorderedMap<number, string>();

        const action = () => map.get(key);

        expect(action).toThrow();
    }
);

test('get should return value, when key exists',
    () =>
    {
        const key = 0;
        const value = 'foo';
        const map = new UnorderedMap<number, string>();
        map.add(key, value);

        const result = map.get(key);

        expect(result).toBe(value);
    }
);

test('get should return value, when key exists, for complex objects',
    () =>
    {
        const initialKey: Complex = {
            foo: 0,
            bar: 'bar'
        };
        const key: Complex = {
            foo: 0,
            bar: 'bar'
        };
        const value: Complex = {
            foo: 1,
            bar: 'baz'
        };
        const map = new UnorderedMap<Complex, Complex>(c => `${c.foo}|${c.bar}`);
        map.add(initialKey, value);

        const result = map.get(key);

        expect(result).toBe(value);
    }
);

test('tryGet should return null, when key doesn\'t exist',
    () =>
    {
        const key = 0;
        const map = new UnorderedMap<number, string>();

        const result = map.tryGet(key);

        expect(result).toBeNull();
    }
);

test('tryGet should return value, when key exists',
    () =>
    {
        const key = 0;
        const value = 'foo';
        const map = new UnorderedMap<number, string>();
        map.add(key, value);

        const result = map.tryGet(key);

        expect(result).toBe(value);
    }
);

test('tryGet should return value, when key exists, for complex objects',
    () =>
    {
        const initialKey: Complex = {
            foo: 0,
            bar: 'bar'
        };
        const key: Complex = {
            foo: 0,
            bar: 'bar'
        };
        const value: Complex = {
            foo: 1,
            bar: 'baz'
        };
        const map = new UnorderedMap<Complex, Complex>(c => `${c.foo}|${c.bar}`);
        map.add(initialKey, value);

        const result = map.tryGet(key);

        expect(result).toBe(value);
    }
);

test('has should return false, when key doesn\'t exist',
    () =>
    {
        const key = 0;
        const map = new UnorderedMap<number, string>();

        const result = map.has(key);

        expect(result).toBe(false);
    }
);

test('has should return true, when key exists',
    () =>
    {
        const key = 0;
        const map = new UnorderedMap<number, string>();
        map.add(key, 'foo');

        const result = map.has(key);

        expect(result).toBe(true);
    }
);

test('has should return true, when key exists, for complex objects',
    () =>
    {
        const initialKey: Complex = {
            foo: 0,
            bar: 'bar'
        };
        const key: Complex = {
            foo: 0,
            bar: 'bar'
        };
        const map = new UnorderedMap<Complex, string>(c => `${c.foo}|${c.bar}`);
        map.add(initialKey, 'foo');

        const result = map.has(key);

        expect(result).toBe(true);
    }
);

test('getOrAdd should add a default object, if key doesn\'t exist',
    () =>
    {
        const key: Complex = {
            foo: 0,
            bar: 'bar'
        };
        const value: Complex = {
            foo: 1,
            bar: 'baz'
        };
        const map = new UnorderedMap<Complex, Complex>(c => `${c.foo}|${c.bar}`);

        const result = map.getOrAdd(key, () => value);

        expect(result).toBe(value);
        expect(map.length).toBe(1);
        expect(map.isEmpty).toBe(false);
    }
);

test('getOrAdd should return existing object',
    () =>
    {
        const initialKey: Complex = {
            foo: 0,
            bar: 'bar'
        };
        const key: Complex = {
            foo: 0,
            bar: 'bar'
        };
        const value: Complex = {
            foo: 1,
            bar: 'baz'
        };
        const defaultValue: Complex = {
            foo: 2,
            bar: 'bax'
        };
        const map = new UnorderedMap<Complex, Complex>(c => `${c.foo}|${c.bar}`);
        map.add(initialKey, value);

        const result = map.getOrAdd(key, () => defaultValue);

        expect(result).toBe(value);
        expect(map.length).toBe(1);
        expect(map.isEmpty).toBe(false);
    }
);

test('add should add a new object',
    () =>
    {
        const key = 0;
        const value = 'foo';
        const map = new UnorderedMap<number, string>();

        map.add(key, value);

        expect(map.get(key)).toBe(value);
        expect(map.length).toBe(1);
        expect(map.isEmpty).toBe(false);
    }
);

test('add should throw an error, if key already exists',
    () =>
    {
        const initialKey: Complex = {
            foo: 0,
            bar: 'bar'
        };
        const key: Complex = {
            foo: 0,
            bar: 'bar'
        };
        const initialValue = 'foo';
        const map = new UnorderedMap<Complex, string>(c => `${c.foo}|${c.bar}`);
        map.add(initialKey, initialValue);

        const action = () => map.add(key, 'bar');

        expect(action).toThrow();
        expect(map.get(key)).toBe(initialValue);
        expect(map.length).toBe(1);
        expect(map.isEmpty).toBe(false);
    }
);

test('tryAdd should add a new object and return true',
    () =>
    {
        const key = 0;
        const value = 'foo';
        const map = new UnorderedMap<number, string>();

        const result = map.tryAdd(key, value);

        expect(result).toBe(true);
        expect(map.get(key)).toBe(value);
        expect(map.length).toBe(1);
        expect(map.isEmpty).toBe(false);
    }
);

test('tryAdd should return false, if key already exists',
    () =>
    {
        const initialKey: Complex = {
            foo: 0,
            bar: 'bar'
        };
        const key: Complex = {
            foo: 0,
            bar: 'bar'
        };
        const initialValue = 'foo';
        const map = new UnorderedMap<Complex, string>(c => `${c.foo}|${c.bar}`);
        map.add(initialKey, initialValue);

        const result = map.tryAdd(key, 'bar');

        expect(result).toBe(false);
        expect(map.get(key)).toBe(initialValue);
        expect(map.length).toBe(1);
        expect(map.isEmpty).toBe(false);
    }
);

test('set should add a new object',
    () =>
    {
        const key = 0;
        const value = 'foo';
        const map = new UnorderedMap<number, string>();

        map.set(key, value);

        expect(map.get(key)).toBe(value);
        expect(map.length).toBe(1);
        expect(map.isEmpty).toBe(false);
    }
);

test('set should replace an object with new value, if key already exists',
    () =>
    {
        const key = 0;
        const initialValue = 'foo';
        const value = 'bar';
        const map = new UnorderedMap<number, string>();
        map.add(key, initialValue);

        map.set(key, value);

        expect(map.get(key)).toBe(value);
        expect(map.length).toBe(1);
        expect(map.isEmpty).toBe(false);
    }
);

test('delete should remove an object',
    () =>
    {
        const initialKey: Complex = {
            foo: 0,
            bar: 'bar'
        };
        const key: Complex = {
            foo: 0,
            bar: 'bar'
        };
        const map = new UnorderedMap<Complex, string>(c => `${c.foo}|${c.bar}`);
        map.add(initialKey, 'foo');

        map.delete(key);

        expect(map.length).toBe(0);
        expect(map.isEmpty).toBe(true);
    }
);

test('delete should throw an error, if key doesn\'t exist',
    () =>
    {
        const key = 0;
        const map = new UnorderedMap<number, string>();

        const action = () => map.delete(key);

        expect(action).toThrow();
        expect(map.length).toBe(0);
        expect(map.isEmpty).toBe(true);
    }
);

test('tryDelete should remove an object and return true',
    () =>
    {
        const initialKey: Complex = {
            foo: 0,
            bar: 'bar'
        };
        const key: Complex = {
            foo: 0,
            bar: 'bar'
        };
        const map = new UnorderedMap<Complex, string>(c => `${c.foo}|${c.bar}`);
        map.add(initialKey, 'foo');

        const result = map.tryDelete(key);

        expect(result).toBe(true);
        expect(map.length).toBe(0);
        expect(map.isEmpty).toBe(true);
    }
);

test('tryDelete should return false, if key doesn\'t exist',
    () =>
    {
        const key = 0;
        const map = new UnorderedMap<number, string>();

        const result = map.tryDelete(key);

        expect(result).toBe(false);
        expect(map.length).toBe(0);
        expect(map.isEmpty).toBe(true);
    }
);

test('clear should remove all objects',
    () =>
    {
        const map = new UnorderedMap<number, string>();
        map.add(0, 'foo');
        map.add(1, 'bar');
        map.add(2, 'baz');

        map.clear();

        expect(map.length).toBe(0);
        expect(map.isEmpty).toBe(true);
    }
);

test('keys should return iterable containing all keys',
    () =>
    {
        const key1: Complex = {
            foo: 0,
            bar: 'bar'
        };
        const key2: Complex = {
            foo: 1,
            bar: 'baz'
        };
        const key3: Complex = {
            foo: 1,
            bar: 'bax'
        };
        const value1 = 'foo';
        const value2 = 'bar';
        const value3 = 'baz';
        const map = new UnorderedMap<Complex, string>(c => `${c.foo}|${c.bar}`);
        map.add(key1, value1);
        map.add(key2, value2);
        map.add(key3, value3);

        const result = Array.from(map.keys());

        expect(result.length).toBe(map.length);
        expect(result).toContain(key1);
        expect(result).toContain(key2);
        expect(result).toContain(key3);
    }
);

test('values should return iterable containing all values',
    () =>
    {
        const key1: Complex = {
            foo: 0,
            bar: 'bar'
        };
        const key2: Complex = {
            foo: 1,
            bar: 'baz'
        };
        const key3: Complex = {
            foo: 1,
            bar: 'bax'
        };
        const value1 = 'foo';
        const value2 = 'bar';
        const value3 = 'baz';
        const map = new UnorderedMap<Complex, string>(c => `${c.foo}|${c.bar}`);
        map.add(key1, value1);
        map.add(key2, value2);
        map.add(key3, value3);

        const result = Array.from(map.values());

        expect(result.length).toBe(map.length);
        expect(result).toContain(value1);
        expect(result).toContain(value2);
        expect(result).toContain(value3);
    }
);

test('iterator symbol should return iterable containing all key-value pairs',
    () =>
    {
        const key1: Complex = {
            foo: 0,
            bar: 'bar'
        };
        const key2: Complex = {
            foo: 1,
            bar: 'baz'
        };
        const key3: Complex = {
            foo: 1,
            bar: 'bax'
        };
        const value1 = 'foo';
        const value2 = 'bar';
        const value3 = 'baz';
        const map = new UnorderedMap<Complex, string>(c => `${c.foo}|${c.bar}`);
        map.add(key1, value1);
        map.add(key2, value2);
        map.add(key3, value3);

        const result = Array.from(map[Symbol.iterator]());

        expect(result.length).toBe(map.length);
        const result1 = result.find(e => e.key === key1);
        expect(result1).toBeDefined();
        expect(result1!.key).toBe(key1);
        expect(result1!.value).toBe(value1);
        const result2 = result.find(e => e.key === key2);
        expect(result2).toBeDefined();
        expect(result2!.key).toBe(key2);
        expect(result2!.value).toBe(value2);
        const result3 = result.find(e => e.key === key3);
        expect(result3).toBeDefined();
        expect(result3!.key).toBe(key3);
        expect(result3!.value).toBe(value3);
    }
);
