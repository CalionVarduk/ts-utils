import { wait } from '../../src/functions/wait';
import { MAX_TIME_OFFSET, MIN_TIME_OFFSET } from '../helpers';
import each from 'jest-each';

each([
    [-1],
    [0],
    [5],
    [10],
    [50],
    [100],
    [200],
    [300],
    [400],
    [500]
])
.test('wait should return a proper promise (%#): ms: %f',
    async (ms: number) =>
    {
        const start = Date.now();
        await wait(ms);
        const end = Date.now();
        const elapsed = end - start;
        const expectedMin = ms - MIN_TIME_OFFSET;
        const expectedMax = ms + MAX_TIME_OFFSET;
        expect(elapsed).toBeGreaterThanOrEqual(expectedMin);
        expect(elapsed).toBeLessThanOrEqual(expectedMax);
    }
);
