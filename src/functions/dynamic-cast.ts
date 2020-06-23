import { ObjectType } from '../types/object-type';
import { PrimitiveTypeNames } from '../types/primitive';
import { primitiveCast, isPrimitiveOfType } from './primitive-cast';
import { instanceOfCast, isInstanceOfType } from './instance-of-cast';
import { reinterpretCast } from './reinterpret-cast';
import { Nullable } from '../types/nullable';
import { TypeInstance } from '../types/type-instance';

/** DynamicCastType type alias. */
export type DynamicCastType<T extends object | PrimitiveTypeNames> =
    T extends object ? ObjectType<T> : T;

/**
 * Casts an object to the provided type, if that object is of that type.
 * @param targetType Type to cast to.
 * @param obj Object to cast.
 * @returns If type `TType` exists in the prototype chain of `obj` or if `obj` is `typeof` `TType`,
 * then `obj` cast to `TType`, otherwise `null`.
 * */
export function dynamicCast<TType extends object | PrimitiveTypeNames>(
    targetType: DynamicCastType<TType>,
    obj: any):
    Nullable<TypeInstance<DynamicCastType<TType>>>
{
    return typeof targetType === 'string' ?
        primitiveCast(reinterpretCast<PrimitiveTypeNames>(targetType), obj) :
        instanceOfCast(reinterpretCast<ObjectType>(targetType), obj);
}

/**
 * Checks whether or not an object is of the provided type.
 * @param targetType Type to check.
 * @param obj Object to check.
 * @returns If type `TType` exists in the prototype chain of `obj` or if `obj` is `typeof` `TType`, then `true`, otherwise `false`.
 */
export function isOfType<TType extends object | PrimitiveTypeNames>(
    targetType: DynamicCastType<TType>,
    obj: any):
    obj is TypeInstance<DynamicCastType<TType>>
{
    return typeof targetType === 'string' ?
        isPrimitiveOfType(reinterpretCast<PrimitiveTypeNames>(targetType), obj) :
        isInstanceOfType(reinterpretCast<ObjectType>(targetType), obj);
}
