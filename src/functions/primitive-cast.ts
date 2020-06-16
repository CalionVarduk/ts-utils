import { PrimitiveTypeNames, PrimitiveTypesMap } from '../types/primitive';
import { Nullable } from '../types/nullable';

/**
 * Checks whether or not an object is `typeof` the provided primitive type.
 * @param targetType Primitive type to check.
 * @param obj Object to check.
 * @returns If `obj` is `typeof` `TType`, then `true`, otherwise `false`.
 */
export function isPrimitiveOfType<TType extends PrimitiveTypeNames>(targetType: TType, obj: any): obj is PrimitiveTypesMap[TType]
{
    return typeof obj === targetType;
}

/**
 * Casts an object to the provided primitive type, if that object is `typeof` that type.
 * @param targetType Primitive type to cast to.
 * @param obj Object to cast.
 * @returns If `obj` is `typeof` `TType`, then `obj` cast to `TType`, otherwise `null`.
 */
export function primitiveCast<TType extends PrimitiveTypeNames>(targetType: TType, obj: any): Nullable<PrimitiveTypesMap[TType]>
{
    return isPrimitiveOfType(targetType, obj) ? obj : null;
}
