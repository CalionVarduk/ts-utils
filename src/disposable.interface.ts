import { reinterpretCast, isPrimitiveOfType, isDefined } from './functions';

/** Represents a disposable object. */
export interface IDisposable
{
    /** Disposes this object. */
    dispose(): void;
}

/**
 * Checks whether or not an object contains a `dispose()` method.
 * @param obj An object to check.
 * @returns If `obj` has `dispose()` method, then `true`, otherwise `false`.
 */
export function isDisposable(obj: any): obj is IDisposable
{
    if (!isDefined(obj))
        return false;

    const disposable = reinterpretCast<Partial<IDisposable>>(obj);
    return isPrimitiveOfType('function', disposable.dispose);
}
