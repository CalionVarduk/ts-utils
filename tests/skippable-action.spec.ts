import { SkippableAction, SkippableActionFactory } from '../src/skippable-action';
import { Nullable } from '../src/types/nullable';
import { wait } from '../src/functions/wait';
import each from 'jest-each';

test('ctor should create properly',
    () =>
    {
        const factory = () => Promise.resolve();
        const skippable = new SkippableAction(factory);

        expect(skippable.isInvoking).toBe(false);
        expect(skippable.isNextInvocationQueued).toBe(false);
        expect(skippable.actionFactory).toBe(factory);
        expect(skippable.current()).toBeNull();
    }
);

test('invoke should return a promise that resolves after the action finishes',
    async () =>
    {
        const args = 'foo';

        let interceptedArgs: Nullable<string> = null;
        let interceptedSkippable: Nullable<SkippableAction<string>> = null;
        let factoryCalled = false;
        const factory: SkippableActionFactory<string> = (a, b) =>
        {
            factoryCalled = true;
            interceptedArgs = a!;
            interceptedSkippable = b;
            expect(skippable.current()).toBeNull();
            expect(skippable.isInvoking).toBe(false);
            expect(skippable.isNextInvocationQueued).toBe(false);
            return Promise.resolve();
        };
        const skippable = new SkippableAction(factory);

        const promise = skippable.invoke(args);
        expect(promise).toBe(skippable.current());
        expect(skippable.isInvoking).toBe(true);
        expect(skippable.isNextInvocationQueued).toBe(false);
        await promise;

        expect(factoryCalled).toBe(true);
        expect(interceptedArgs).toBe(args);
        expect(interceptedSkippable).toBe(skippable);
        expect(skippable.current()).toBeNull();
        expect(skippable.isInvoking).toBe(false);
        expect(skippable.isNextInvocationQueued).toBe(false);
    }
);

each([
    [0],
    [1],
    [2],
    [3],
    [10],
    [100]
])
.test('invoke should skip intermediate invocations queued in the process of another invocation, ' +
    'and store only the last one (%#): intermediate action count: %f',
    async (count: number) =>
    {
        const args = ['foo', 'bar'];

        const interceptedArgs: string[] = [];
        const interceptedSkippable: SkippableAction<string>[] = [];
        let factoryCallCount = 0;

        const factory: SkippableActionFactory<string> = (a, b) =>
        {
            ++factoryCallCount;
            interceptedArgs.push(a!);
            interceptedSkippable.push(b);
            return wait(100);
        };
        const skippable = new SkippableAction(factory);

        const firstPromise = skippable.invoke(args[0]);

        const intermediatePromises: Promise<void>[] = [];
        for (let i = 0; i < count; ++i)
            intermediatePromises.push(skippable.invoke());

        const lastPromise = skippable.invoke(args[1]);

        expect(factoryCallCount).toBe(1);
        expect(interceptedArgs).toMatchObject([args[0]]);
        expect(interceptedSkippable).toMatchObject([skippable]);
        expect(firstPromise).toBe(lastPromise);
        expect(lastPromise).toBe(skippable.current());
        expect(skippable.isInvoking).toBe(true);
        expect(skippable.isNextInvocationQueued).toBe(true);

        for (const intermediatePromise of intermediatePromises)
            expect(intermediatePromise).toBe(firstPromise);

        await firstPromise;

        const queuedPromise = skippable.current();

        expect(queuedPromise).not.toBeNull();
        expect(skippable.isInvoking).toBe(true);
        expect(skippable.isNextInvocationQueued).toBe(false);

        await queuedPromise!;

        expect(factoryCallCount).toBe(2);
        expect(interceptedArgs).toMatchObject(args);
        expect(interceptedSkippable).toMatchObject([skippable, skippable]);
        expect(skippable.current()).toBeNull();
        expect(skippable.isInvoking).toBe(false);
        expect(skippable.isNextInvocationQueued).toBe(false);
    }
);
