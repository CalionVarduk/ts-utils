import { PrimitiveTypeNames, PrimitiveTypesMap } from '../types/primitive';
import { Nullable } from '../types/nullable';

/**
 * Checks whether or not an object is `typeof` the provided primitive type.
 * @param targetType primitive type to check
 * @param obj object to check
 * @returns if `obj` is `typeof` `TType`, then `true`, otherwise `false`
 */
export function isPrimitiveOfType<TType extends PrimitiveTypeNames>(targetType: TType, obj: any): obj is PrimitiveTypesMap[TType]
{
    return typeof obj === targetType;
}

/**
 * Casts an object to the provided primitive type, if that object is `typeof` that type.
 * @param targetType primitive type to cast to
 * @param obj object to cast
 * @returns if `obj` is `typeof` `TType`, then `obj` cast to `TType`, otherwise `null`
 */
export function primitiveCast<TType extends PrimitiveTypeNames>(targetType: TType, obj: any): Nullable<PrimitiveTypesMap[TType]>
{
    return isPrimitiveOfType(targetType, obj) ? obj : null;
}
