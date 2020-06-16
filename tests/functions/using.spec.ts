import { using, usingAsync } from '../../src/functions/using';
import { IDisposable } from '../../src/disposable.interface';
import { wait } from '../../src/functions/wait';

class Foo implements IDisposable
{
    public isDisposed: boolean = false;
    public dispose(): void
    {
        this.isDisposed = true;
    }
}

test('using should dispose object after performing action',
    () =>
    {
        const foo = new Foo();
        let actionPerformed = false;

        using(foo, f =>
            {
                expect(f).toBe(foo);
                actionPerformed = true;
            });
        expect(actionPerformed).toBe(true);
        expect(foo.isDisposed).toBe(true);
    }
);

test('using should call onFinally callback',
    () =>
    {
        const foo = new Foo();
        let actionPerformed = false;
        let onFinallyCalled = false;

        using(foo, f =>
            {
                expect(f).toBe(foo);
                actionPerformed = true;
            }, {
                onFinally: () =>
                    {
                        expect(actionPerformed).toBe(true);
                        expect(foo.isDisposed).toBe(true);
                        onFinallyCalled = true;
                    }
        });

        expect(onFinallyCalled).toBe(true);
    }
);

test('using should throw',
    () =>
    {
        const foo = new Foo();
        const error = new Error();
        let actionPerformed = false;

        const action = () =>
        {
            using(foo, f =>
                {
                    expect(f).toBe(foo);
                    actionPerformed = true;
                    throw error;
                });
        };

        expect(action).toThrow(error);
        expect(actionPerformed).toBe(true);
        expect(foo.isDisposed).toBe(true);
    }
);

test('using should throw and call onCatch callback',
    () =>
    {
        const foo = new Foo();
        const error = new Error();
        let actionPerformed = false;
        let onCatchCalled = false;

        const action = () =>
        {
            using(foo, f =>
                {
                    expect(f).toBe(foo);
                    actionPerformed = true;
                    throw error;
                },
                {
                    onCatch: e =>
                        {
                            expect(actionPerformed).toBe(true);
                            expect(foo.isDisposed).toBe(false);
                            expect(e).toBe(error);
                            onCatchCalled = true;
                        }
                });
        };

        expect(action).toThrow(error);
        expect(foo.isDisposed).toBe(true);
        expect(onCatchCalled).toBe(true);
    }
);

test('using with swallowError set to true should not throw',
    () =>
    {
        const foo = new Foo();
        const error = new Error();
        let actionPerformed = false;
        let onCatchCalled = false;

        const action = () =>
        {
            using(foo, f =>
                {
                    expect(f).toBe(foo);
                    actionPerformed = true;
                    throw error;
                },
                {
                    swallowError: true,
                    onCatch: e =>
                    {
                        expect(actionPerformed).toBe(true);
                        expect(foo.isDisposed).toBe(false);
                        expect(e).toBe(error);
                        onCatchCalled = true;
                    }
                });
        };

        expect(action).not.toThrow();
        expect(foo.isDisposed).toBe(true);
        expect(onCatchCalled).toBe(true);
    }
);

test('using with swallowError set to false should throw',
    () =>
    {
        const foo = new Foo();
        const error = new Error();
        let actionPerformed = false;

        const action = () =>
        {
            using(foo, f =>
                {
                    expect(f).toBe(foo);
                    actionPerformed = true;
                    throw error;
                },
                {
                    swallowError: false
                });
        };

        expect(action).toThrow(error);
        expect(foo.isDisposed).toBe(true);
    }
);

test('using should call both onCatch and onFinally callbacks',
    () =>
    {
        const foo = new Foo();
        const error = new Error();
        let actionPerformed = false;
        let onCatchCalled = false;
        let onFinallyCalled = false;

        const action = () =>
        {
            using(foo, f =>
                {
                    expect(f).toBe(foo);
                    actionPerformed = true;
                    throw error;
                },
                {
                    swallowError: true,
                    onCatch: e =>
                    {
                        expect(actionPerformed).toBe(true);
                        expect(foo.isDisposed).toBe(false);
                        expect(e).toBe(error);
                        onCatchCalled = true;
                    },
                    onFinally: () =>
                        {
                            expect(onCatchCalled).toBe(true);
                            expect(foo.isDisposed).toBe(true);
                            onFinallyCalled = true;
                        }
                });
        };

        expect(action).not.toThrow();
        expect(onFinallyCalled).toBe(true);
    }
);

test('usingAsync should dispose object after performing action',
    async () =>
    {
        const foo = new Foo();
        let actionPerformed = false;

        await usingAsync(foo, async f =>
            {
                expect(f).toBe(foo);
                await wait(1);
                actionPerformed = true;
            });
        expect(actionPerformed).toBe(true);
        expect(foo.isDisposed).toBe(true);
    }
);

test('usingAsync should call onFinally callback',
    async () =>
    {
        const foo = new Foo();
        let actionPerformed = false;
        let onFinallyCalled = false;

        await usingAsync(foo, async f =>
            {
                expect(f).toBe(foo);
                await wait(1);
                actionPerformed = true;
            }, {
                onFinally: () =>
                    {
                        expect(actionPerformed).toBe(true);
                        expect(foo.isDisposed).toBe(true);
                        onFinallyCalled = true;
                    }
        });

        expect(onFinallyCalled).toBe(true);
    }
);

test('usingAsync should throw',
    async () =>
    {
        const foo = new Foo();
        const error = new Error();
        let actionPerformed = false;

        try
        {
            await usingAsync(foo, async f =>
                {
                    expect(f).toBe(foo);
                    await wait(1);
                    actionPerformed = true;
                    throw error;
                });
        }
        catch (e)
        {
            expect(e).toBe(error);
        }

        expect(actionPerformed).toBe(true);
        expect(foo.isDisposed).toBe(true);
    }
);

test('usingAsync should throw and call onCatch callback',
async () =>
    {
        const foo = new Foo();
        const error = new Error();
        let actionPerformed = false;
        let onCatchCalled = false;

        try
        {
            await usingAsync(foo, async f =>
                {
                    expect(f).toBe(foo);
                    await wait(1);
                    actionPerformed = true;
                    throw error;
                },
                {
                    onCatch: e =>
                        {
                            expect(actionPerformed).toBe(true);
                            expect(foo.isDisposed).toBe(false);
                            expect(e).toBe(error);
                            onCatchCalled = true;
                        }
                });
        }
        catch (e)
        {
            expect(e).toBe(error);
        }

        expect(foo.isDisposed).toBe(true);
        expect(onCatchCalled).toBe(true);
    }
);

test('usingAsync with swallowError set to true should not throw',
async () =>
    {
        const foo = new Foo();
        const error = new Error();
        let actionPerformed = false;
        let onCatchCalled = false;

        await usingAsync(foo, async f =>
            {
                expect(f).toBe(foo);
                await wait(1);
                actionPerformed = true;
                throw error;
            },
            {
                swallowError: true,
                onCatch: e =>
                {
                    expect(actionPerformed).toBe(true);
                    expect(foo.isDisposed).toBe(false);
                    expect(e).toBe(error);
                    onCatchCalled = true;
                }
            });

        expect(foo.isDisposed).toBe(true);
        expect(onCatchCalled).toBe(true);
    }
);

test('usingAsync with swallowError set to false should throw',
async () =>
    {
        const foo = new Foo();
        const error = new Error();
        let actionPerformed = false;

        try
        {
            await usingAsync(foo, async f =>
                {
                    expect(f).toBe(foo);
                    await wait(1);
                    actionPerformed = true;
                    throw error;
                },
                {
                    swallowError: false
                });
            }
        catch (e)
        {
            expect(e).toBe(error);
        }

        expect(foo.isDisposed).toBe(true);
    }
);

test('usingAsync should call both onCatch and onFinally callbacks',
async () =>
    {
        const foo = new Foo();
        const error = new Error();
        let actionPerformed = false;
        let onCatchCalled = false;
        let onFinallyCalled = false;

        await usingAsync(foo, async f =>
            {
                expect(f).toBe(foo);
                await wait(1);
                actionPerformed = true;
                throw error;
            },
            {
                swallowError: true,
                onCatch: e =>
                {
                    expect(actionPerformed).toBe(true);
                    expect(foo.isDisposed).toBe(false);
                    expect(e).toBe(error);
                    onCatchCalled = true;
                },
                onFinally: () =>
                    {
                        expect(onCatchCalled).toBe(true);
                        expect(foo.isDisposed).toBe(true);
                        onFinallyCalled = true;
                    }
            });

        expect(onFinallyCalled).toBe(true);
    }
);
