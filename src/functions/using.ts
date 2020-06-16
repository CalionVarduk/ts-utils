import { IDisposable } from '../disposable.interface';
import { isUndefined } from './is-undefined';

/** Represents `using` function's additional parameters. */
export type UsingParams =
{
    /**
     * Specifies whether or not the `using` function should swallow an error, if any is thrown.
     * By default the error will not be swallowed.
     * */
    swallowError?: boolean;

    /**
     * Specifies an on `catch` error callback.
     * @param error caught error
     */
    onCatch?(error: any): void;

    /** Specifies an on `finally` callback, after an object has been disposed. */
    onFinally?(): void;
};

/**
 * Performs an `action` on `IDisposable` object, then disposes it.
 * @param obj Disposable object to perform an action on.
 * @param action Action to perform.
 * @param params Optional parameters.
 */
export function using<T extends IDisposable>(
    obj: T,
    action: (o: T) => void,
    params?: UsingParams):
    void
{
    try
    {
        action(obj);
    }
    catch (e)
    {
        if (isUndefined(params))
            throw e;

        if (!isUndefined(params.onCatch))
            params.onCatch(e);

        if (params.swallowError !== true)
            throw e;
    }
    finally
    {
        obj.dispose();
        if (!isUndefined(params) && !isUndefined(params.onFinally))
            params.onFinally();
    }
}

/**
 * Performs an async `action` on `IDisposable` object, then disposes it.
 * @param obj Disposable object to perform an action on.
 * @param action Action to perform.
 * @param params Optional parameters.
 */
export async function usingAsync<T extends IDisposable>(
    obj: T,
    action: (o: T) => Promise<void>,
    params?: UsingParams):
    Promise<void>
{
    try
    {
        await action(obj);
    }
    catch (e)
    {
        if (isUndefined(params))
            throw e;

        if (!isUndefined(params.onCatch))
            params.onCatch(e);

        if (params.swallowError !== true)
            throw e;
    }
    finally
    {
        obj.dispose();
        if (!isUndefined(params) && !isUndefined(params.onFinally))
            params.onFinally();
    }
}
