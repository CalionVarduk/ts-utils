import { Optional } from '../types/optional';
import { isNull } from './is-null';
import { isUndefined } from './is-undefined';

/**
 * Checks whether or not an object is not `null` and not `undefined`.
 * @param obj Object to check.
 * @returns If `obj` is `null` or `undefined`, then `false`, otherwise `true`.
 */
export function isDefined<T>(obj: Optional<T>): obj is T
{
    return !isUndefined(obj) && !isNull(obj);
}
