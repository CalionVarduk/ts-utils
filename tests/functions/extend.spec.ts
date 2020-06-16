import { extend } from '../../src/functions/extend';
import { Nullable } from '../../src/types';

test('extend should create a proper function',
    () =>
    {
        const arg1 = 10;
        const arg2 = 'foo';
        const targetReturn = 'target';
        const extensionReturn = 'extension';

        let targetCalled = false;
        let targetArgs: Nullable<[number, string]> = null;
        let extensionCalled = false;
        let extensionArgs: Nullable<[number, string]> = null;

        const target = (a: number, b: string) =>
        {
            expect(extensionCalled).toBe(false);
            targetCalled = true;
            targetArgs = [a, b];
            return targetReturn;
        };
        const extension = (a: number, b: string) =>
        {
            expect(targetCalled).toBe(true);
            extensionCalled = true;
            extensionArgs = [a, b];
            return extensionReturn;
        };

        const result = extend(target, extension);
        const returned = result(arg1, arg2);

        expect(result).not.toBe(target);
        expect(result).not.toBe(extension);
        expect(extensionCalled).toBe(true);
        expect(targetArgs![0]).toBe(arg1);
        expect(targetArgs![1]).toBe(arg2);
        expect(extensionArgs![0]).toBe(arg1);
        expect(extensionArgs![1]).toBe(arg2);
        expect(returned).toBe(extensionReturn);
    }
);

test('extend should create a proper function, no target',
    () =>
    {
        const extension = () => {};

        const result = extend<() => void>(null, extension);

        expect(result).toBe(extension);
    }
);
