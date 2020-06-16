import { DeepReadonly } from '../types/deep-readonly';
import { reinterpretCast } from './reinterpret-cast';
import { isPrimitiveOfType } from './primitive-cast';
import { isNull } from './is-null';

/**
 * Deep freezes the `obj` recursively and returns it.
 * @param obj Object to deep freeze.
 * @returns Deep frozen `obj`.
 */
export function deepFreeze<T = any>(obj: T): DeepReadonly<T>
{
    if (isPrimitiveOfType('object', obj))
    {
        if (!isNull(obj))
        {
            for (const propertyName of Object.getOwnPropertyNames(obj))
                deepFreeze(reinterpretCast<any>(obj)[propertyName]);

            Object.freeze(obj);
        }
    }
    else if (isPrimitiveOfType('function', obj))
        Object.freeze(obj);

    return reinterpretCast<DeepReadonly<T>>(obj);
}
