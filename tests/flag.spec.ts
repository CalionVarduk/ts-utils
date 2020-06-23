import { Flag } from '../src/flag';

test('ctor should create with proper value',
    () =>
    {
        const value = { a: 'a' };
        const flag = new Flag(value);
        expect(flag.value).toBe(value);
    }
);

test('exchange should change value properly and return correct result',
    () =>
    {
        const value = { a: 'a' };
        const flag = new Flag(value);
        const newValue = { a: 'b' };
        const result = flag.exchange(newValue);
        expect(result).toBe(value);
        expect(flag.value).toBe(newValue);
    }
);

test('update should change value properly',
    () =>
    {
        const value = { a: 'a' };
        const flag = new Flag(value);
        const newValue = { a: 'b' };
        flag.update(newValue);
        expect(flag.value).toBe(newValue);
    }
);
