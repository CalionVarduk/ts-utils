import { ObjectType, AbstractObjectType } from '../types/object-type';
import { Nullable } from '../types/nullable';

/**
 * Checks whether or not an object is `instanceof` the provided type.
 * @param targetType Type to check.
 * @param obj Object to check.
 * @returns If type `TType` exists in the prototype chain of `obj`, then `true`, otherwise `false`.
 */
export function isInstanceOfType<TType>(targetType: ObjectType<TType> | AbstractObjectType<TType>, obj: any): obj is TType
{
    return obj instanceof targetType;
}

/**
 * Casts an object to the provided type, if that object is `instanceof` type.
 * @param targetType Type to cast to.
 * @param obj Object to cast.
 * @returns If type `TType` exists in the prototype chain of `obj`, then `obj` cast to `TType`, otherwise `null`.
 */
export function instanceOfCast<TType>(targetType: ObjectType<TType> | AbstractObjectType<TType>, obj: any): Nullable<TType>
{
    return isInstanceOfType(targetType, obj) ? obj : null;
}
