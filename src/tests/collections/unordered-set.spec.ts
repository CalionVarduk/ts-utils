import { UnorderedSet } from '../../core/collections/unordered-set';

type Complex =
{
    foo: number;
    bar: string;
};

test('ctor should create a proper UnorderedSet object',
    () =>
    {
        const result = new UnorderedSet<number>();

        expect(result.length).toBe(0);
        expect(result.isEmpty).toBe(true);
        expect(result.stringifier).toBeTruthy();
    }
);

test('ctor should create a proper UnorderedSet object, with custom stringifier',
    () =>
    {
        const stringifier = (n: number) => (n + 1).toString();

        const result = new UnorderedSet<number>(stringifier);

        expect(result.length).toBe(0);
        expect(result.isEmpty).toBe(true);
        expect(result.stringifier).toBe(stringifier);
    }
);

test('has should return false, when object doesn\'t exist',
    () =>
    {
        const value = 0;
        const set = new UnorderedSet<number>();

        const result = set.has(value);

        expect(result).toBe(false);
    }
);

test('has should return true, when object exists',
    () =>
    {
        const value = 0;
        const set = new UnorderedSet<number>();
        set.add(value);

        const result = set.has(value);

        expect(result).toBe(true);
    }
);

test('has should return true, when object exists, for complex objects',
    () =>
    {
        const initial: Complex = {
            foo: 0,
            bar: 'bar'
        };
        const value: Complex = {
            foo: 0,
            bar: 'bar'
        };
        const set = new UnorderedSet<Complex>(c => `${c.foo}|${c.bar}`);
        set.add(initial);

        const result = set.has(value);

        expect(result).toBe(true);
    }
);

test('add should add a new object',
    () =>
    {
        const value = 0;
        const set = new UnorderedSet<number>();

        set.add(value);

        expect(set.has(value)).toBe(true);
        expect(set.length).toBe(1);
        expect(set.isEmpty).toBe(false);
    }
);

test('add should throw an error, if object already exists',
    () =>
    {
        const initial: Complex = {
            foo: 0,
            bar: 'bar'
        };
        const value: Complex = {
            foo: 0,
            bar: 'bar'
        };
        const set = new UnorderedSet<Complex>(c => `${c.foo}|${c.bar}`);
        set.add(initial);

        const action = () => set.add(value);

        expect(action).toThrow();
        expect(set.length).toBe(1);
        expect(set.isEmpty).toBe(false);
    }
);

test('tryAdd should add a new object and return true',
    () =>
    {
        const value = 0;
        const set = new UnorderedSet<number>();

        const result = set.tryAdd(value);

        expect(result).toBe(true);
        expect(set.has(value)).toBe(true);
        expect(set.length).toBe(1);
        expect(set.isEmpty).toBe(false);
    }
);

test('tryAdd should return false, if object already exists',
    () =>
    {
        const initial: Complex = {
            foo: 0,
            bar: 'bar'
        };
        const value: Complex = {
            foo: 0,
            bar: 'bar'
        };
        const set = new UnorderedSet<Complex>(c => `${c.foo}|${c.bar}`);
        set.add(initial);

        const result = set.tryAdd(value);

        expect(result).toBe(false);
        expect(set.length).toBe(1);
        expect(set.isEmpty).toBe(false);
    }
);

test('delete should remove an object',
    () =>
    {
        const initial: Complex = {
            foo: 0,
            bar: 'bar'
        };
        const value: Complex = {
            foo: 0,
            bar: 'bar'
        };
        const set = new UnorderedSet<Complex>(c => `${c.foo}|${c.bar}`);
        set.add(initial);

        set.delete(value);

        expect(set.length).toBe(0);
        expect(set.isEmpty).toBe(true);
    }
);

test('delete should throw an error, if object doesn\'t exist',
    () =>
    {
        const value = 0;
        const set = new UnorderedSet<number>();

        const action = () => set.delete(value);

        expect(action).toThrow();
        expect(set.length).toBe(0);
        expect(set.isEmpty).toBe(true);
    }
);

test('tryDelete should remove an object and return true',
    () =>
    {
        const initial: Complex = {
            foo: 0,
            bar: 'bar'
        };
        const value: Complex = {
            foo: 0,
            bar: 'bar'
        };
        const set = new UnorderedSet<Complex>(c => `${c.foo}|${c.bar}`);
        set.add(initial);

        const result = set.tryDelete(value);

        expect(result).toBe(true);
        expect(set.length).toBe(0);
        expect(set.isEmpty).toBe(true);
    }
);

test('tryDelete should return false, if object doesn\'t exist',
    () =>
    {
        const value = 0;
        const set = new UnorderedSet<number>();

        const result = set.tryDelete(value);

        expect(result).toBe(false);
        expect(set.length).toBe(0);
        expect(set.isEmpty).toBe(true);
    }
);

test('clear should remove all objects',
    () =>
    {
        const set = new UnorderedSet<number>();
        set.add(0);
        set.add(1);
        set.add(2);

        set.clear();

        expect(set.length).toBe(0);
        expect(set.isEmpty).toBe(true);
    }
);

test('entries should return iterable containing all objects',
    () =>
    {
        const set = new UnorderedSet<number>();
        set.add(0);
        set.add(1);
        set.add(2);

        const result = Array.from(set.entries());

        expect(result.length).toBe(set.length);
        expect(result).toContain(0);
        expect(result).toContain(1);
        expect(result).toContain(2);
    }
);

test('iterator symbol should return iterable containing all objects',
    () =>
    {
        const set = new UnorderedSet<number>();
        set.add(0);
        set.add(1);
        set.add(2);

        const result = Array.from(set[Symbol.iterator]());

        expect(result.length).toBe(set.length);
        expect(result).toContain(0);
        expect(result).toContain(1);
        expect(result).toContain(2);
    }
);
