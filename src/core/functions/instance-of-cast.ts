import { ObjectType } from '../types/object-type';
import { Nullable } from '../types/nullable';

/**
 * Checks whether or not an object is `instanceof` the provided type.
 * @param targetType type to check
 * @param obj object to check
 * @returns if type `TType` exists in the prototype chain of `obj`, then `true`, otherwise `false`
 */
export function isInstanceOfType<TType>(targetType: ObjectType<TType>, obj: any): obj is TType
{
    return obj instanceof targetType;
}

/**
 * Casts an object to the provided type, if that object is `instanceof` type.
 * @param targetType type to cast to
 * @param obj object to cast
 * @returns if type `TType` exists in the prototype chain of `obj`, then `obj` cast to `TType`, otherwise `null`
 */
export function instanceOfCast<TType>(targetType: ObjectType<TType>, obj: any): Nullable<TType>
{
    return isInstanceOfType(targetType, obj) ? obj : null;
}
