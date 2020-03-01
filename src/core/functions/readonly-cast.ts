import { reinterpretCast } from './reinterpret-cast';
import { DeepReadonly } from '../types/deep-readonly';

/**
 * Forces the `Readonly` object to be treated as non-readonly.
 * @param obj object to cast
 * @returns `obj` cast to `T` type
 * */
export function readonlyCast<T>(obj: Readonly<T>): T
{
    return reinterpretCast<T>(obj);
}

/**
 * Forces the `DeepReadonly` object to be treated as non-deep-readonly.
 * @param obj object to cast
 * @returns `obj` cast to `T` type
 * */
export function deepReadonlyCast<T>(obj: DeepReadonly<T>): T
{
    return reinterpretCast<T>(obj);
}
