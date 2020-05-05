import { IDisposable } from '../disposable.interface';
import { isUndefined } from './is-undefined';

export type UsingParams =
{
    swallowError?: boolean;
    onCatch?(error: any): void;
    onFinally?(): void;
};

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
