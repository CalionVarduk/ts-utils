import { Mixin, makeMixin } from '../core/mixin';

test('makeMixin should return correct result',
    () =>
    {
        const obj1 =
        {
            a: 'a',
            b: 0
        };
        const obj2 =
        {
            c: true,
            b: 1
        };
        const result = makeMixin(obj1, obj2);
        expect(result).not.toBe(obj1);
        expect(result).not.toBe(obj2);
        expect(result.a).toBe(obj1.a);
        expect(result.b).toBe(obj2.b);
        expect(result.c).toBe(obj2.c);
    }
);

test('ctor should create with proper value',
    () =>
    {
        const value = 'str';
        const mixin = new Mixin(value);
        expect(mixin.value).toBe(value);
    }
);

test('and should return correct result',
    () =>
    {
        const mixin1 = new Mixin(
            {
                a: 'a',
                b: 0
            }
        );
        const mixin2 = new Mixin(
            {
                c: true,
                b: 1
            }
        );
        const result1 = mixin1.and(mixin2);
        const result2 = mixin1.and(mixin2.value);
        expect(result1).not.toBe(mixin1);
        expect(result1).not.toBe(mixin2);
        expect(result1.value).not.toBe(mixin1.value);
        expect(result1.value).not.toBe(mixin2.value);
        expect(result1.value.a).toBe(mixin1.value.a);
        expect(result1.value.b).toBe(mixin2.value.b);
        expect(result1.value.c).toBe(mixin2.value.c);
        expect(result2).not.toBe(mixin1);
        expect(result2).not.toBe(mixin2);
        expect(result2.value).not.toBe(mixin1.value);
        expect(result2.value).not.toBe(mixin2.value);
        expect(result2.value.a).toBe(mixin1.value.a);
        expect(result2.value.b).toBe(mixin2.value.b);
        expect(result2.value.c).toBe(mixin2.value.c);
    }
);
