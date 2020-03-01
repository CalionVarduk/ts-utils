import { Nullable } from '../types/nullable';

/**
 * Checks whether or not an object is `null`.
 * @param obj object to check
 * @returns if `obj` is `null`, then `true`, otherwise `false`
 */
export function isNull<T>(obj: Nullable<T>): obj is null
{
    return obj === null;
}
