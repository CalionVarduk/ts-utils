import { deepFreeze } from '../../core/functions/deep-freeze';

type Foo =
{
    a: string;
    b: Function;
    c: number[];
    d:
    {
        e: boolean;
        f:
        {
            g: number;
            h: string[];
        };
    };
    i:
    ({
        j: number;
        k: boolean;
    } | null | undefined)[];
};

test('deep freeze should return correct result',
    () =>
    {
        const foo: Foo =
        {
            a: 'a',
            b: function() {},
            c: [1, 2, 3],
            d:
            {
                e: true,
                f:
                {
                    g: 0,
                    h: ['a', 'b']
                }
            },
            i:
            [
                {
                    j: 1,
                    k: false,
                },
                null,
                void(0),
                {
                    j: 2,
                    k: true
                }
            ]
        };
        const result = deepFreeze(foo);
        expect(result).toBe(foo);
        expect(Object.isFrozen(result)).toBe(true);
        expect(Object.isFrozen(result.b)).toBe(true);
        expect(Object.isFrozen(result.c)).toBe(true);
        expect(Object.isFrozen(result.d)).toBe(true);
        expect(Object.isFrozen(result.d.f)).toBe(true);
        expect(Object.isFrozen(result.d.f.h)).toBe(true);
        expect(Object.isFrozen(result.i)).toBe(true);
        expect(Object.isFrozen(result.i[0])).toBe(true);
        expect(Object.isFrozen(result.i[3])).toBe(true);
    }
);
