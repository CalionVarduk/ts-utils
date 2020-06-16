import { Semaphore, Mutex } from '../core/semaphore';
import { wait } from '../core/functions';
import each from 'jest-each';

each([
    [1],
    [2],
    [5],
    [10],
    [100]
])
.test('ctor should create properly (%#): count: %f',
    (count: number) =>
    {

        const result = new Semaphore(count);
        expect(result.count).toBe(count);
        expect(result.value).toBe(count);
    }
);

each([
    [0],
    [-1]
])
.test('ctor should throw when count is less than 1',
    (count: number) =>
    {
        const action = () => new Semaphore(count);
        expect(action).toThrow();
    }
);

test('Mutex ctor should create properly',
    () =>
    {
        const result = new Mutex();
        expect(result instanceof Semaphore).toBe(true);
        expect(result.count).toBe(1);
        expect(result.value).toBe(1);
    }
);

each([
    [1, 'ABCDE'],
    [2, 'BCAED'],
    [3, 'CBAED'],
    [4, 'CBAED'],
    [5, 'CBAED']
])
.test('dispatch should queue actions properly (%#): count: %f, expected: %s',
    async (count: number, expected: string) =>
    {
        const semaphore = new Semaphore(count);

        let result = '';

        semaphore.dispatch(() => wait(400).then(() => 'A')).then(r => result += r);
        semaphore.dispatch(() => wait(200).then(() => 'B')).then(r => result += r);
        semaphore.dispatch(() => wait(100).then(() => 'C')).then(r => result += r);
        semaphore.dispatch(() => wait(1000).then(() => 'D')).then(r => result += r);
        semaphore.dispatch(() => wait(700).then(() => 'E')).then(r => result += r);
        await wait(2700);

        expect(result).toBe(expected);
    }
);
