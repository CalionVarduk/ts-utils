import { Rng } from '../src/rng';
import each from 'jest-each';

const TEST_LIMIT = 200;

each([
    [0, 1],
    [-1, 0],
    [0.5, 0.6],
    [0, 1000000],
    [-1000000, 1000000]
])
.test('next should return correct value (%#): min: %f, max: %f',
    (min: number, max: number) =>
    {
        const rng = new Rng();

        for (let i = 0; i < TEST_LIMIT; ++i)
        {
            const result = rng.next(min, max);
            expect(result).toBeGreaterThanOrEqual(min);
            expect(result).toBeLessThan(max);
        }
    }
);

each([
    [0, 2],
    [-1, 1],
    [-10, 10],
    [0, 1000000],
    [-1000000, 1000000]
])
.test('nextInt should return correct value (%#): min: %f, max: %f',
    (min: number, max: number) =>
    {
        const rng = new Rng();

        for (let i = 0; i < TEST_LIMIT; ++i)
        {
            const result = rng.nextInt(min, max);
            expect(result).toBeGreaterThanOrEqual(min);
            expect(result).toBeLessThan(max);
            expect(result).toBe(Math.trunc(result));
        }
    }
);

test('nextInt should return safe integer',
    () =>
    {
        const rng = new Rng();

        for (let i = 0; i < TEST_LIMIT; ++i)
        {
            const result = rng.nextInt(
                -(Number.MIN_SAFE_INTEGER * Number.MIN_SAFE_INTEGER),
                Number.MAX_SAFE_INTEGER * Number.MAX_SAFE_INTEGER);

            expect(result).toBeGreaterThanOrEqual(Number.MIN_SAFE_INTEGER);
            expect(result).toBeLessThan(Number.MAX_SAFE_INTEGER);
            expect(result).toBe(Math.trunc(result));
        }
    }
);

test('nextBoolean should return correct value',
    () =>
    {
        const rng = new Rng();

        const result = rng.nextBoolean();

        expect(typeof result).toBe('boolean');
    }
);

test('iterator symbol should return correct iterable',
    () =>
    {
        const testLimit = 10000;
        const rng = new Rng();
        let index = 0;

        for (const n of rng)
        {
            if (index++ > testLimit)
                break;

            expect(n).toBeGreaterThanOrEqual(0);
            expect(n).toBeLessThan(1);
        }
    }
);
