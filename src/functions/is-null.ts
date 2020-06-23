import { Nullable } from '../types/nullable';

/**
 * Checks whether or not an object is `null`.
 * @param obj Object to check.
 * @returns If `obj` is `null`, then `true`, otherwise `false`.
 */
export function isNull<T>(obj: Nullable<T>): obj is null
{
    return obj === null;
}
