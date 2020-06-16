import { Ensured } from '../types/ensured';
import { Optional } from '../types/optional';
import { isDefined } from './is-defined';
import { reinterpretCast } from './reinterpret-cast';

/**
 * Returns a function, that - once invoked - first calls the `target` function, and then follows it up with a call to the `extension`.
 * @param target Target function.
 * @param extension Extension to the `target`.
 * @returns `extension`, if `target` is `null` or `undefined`, otherwise a new function.
 */
export function extend<T extends (...args: any[]) => any>(target: Optional<T>, extension: Ensured<T>): Ensured<T>
{
    if (!isDefined(target))
        return extension;

    const result = (...args: any[]) => {
        target(...args);
        return extension(...args);
    };
    return reinterpretCast<Ensured<T>>(result);
}
