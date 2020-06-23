import { Lazy } from '../src/lazy';

test('ctor should create properly',
    () =>
    {
        const result = 10;
        const lazy = new Lazy(() => result);
        expect(lazy.isValueCreated).toBe(false);
        expect(lazy.value).toBe(result);
    }
);

test('getting value should invoke the provider',
    () =>
    {
        let providerInvoked = false;
        const result = 10;
        const lazy = new Lazy(() =>
        {
            providerInvoked = true;
            return result;
        });
        expect(lazy.value).toBe(result);
        expect(lazy.isValueCreated).toBe(true);
        expect(providerInvoked).toBe(true);
    }
);

test('getting value multiple times should not invoke the provider more than once',
    () =>
    {
        let providerInvocationCount = 0;
        const result = 10;
        const lazy = new Lazy(() =>
        {
            ++providerInvocationCount;
            return result;
        });
        const v1 = lazy.value;
        const v2 = lazy.value;
        const v3 = lazy.value;
        expect(providerInvocationCount).toBe(1);
    }
);
