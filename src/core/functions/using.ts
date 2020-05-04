import { IDisposable } from '../disposable.interface';
import { isUndefined } from './is-undefined';

export type UsingParams =
{
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
        if (!isUndefined(params) && !isUndefined(params.onCatch))
            params.onCatch(e);
    }
    finally
    {
        obj.dispose();
        if (!isUndefined(params) && !isUndefined(params.onFinally))
            params.onFinally();
    }
}
