import { Undefinable } from '../types/undefinable';

/**
 * Checks whether or not an object is `undefined`.
 * @param obj object to check
 * @returns if `obj` is `undefined`, then `true`, otherwise `false`
 */
export function isUndefined<T>(obj: Undefinable<T>): obj is undefined
{
    return obj === void(0);
}
