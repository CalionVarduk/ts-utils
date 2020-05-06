import { ObjectType } from '../types/object-type';
import { PrimitiveTypeNames, PrimitiveTypesMap } from '../types/primitive';
import { primitiveCast, isPrimitiveOfType } from './primitive-cast';
import { instanceOfCast, isInstanceOfType } from './instance-of-cast';
import { reinterpretCast } from './reinterpret-cast';
import { Nullable } from '../types/nullable';

/** SafeCast type alias. */
export type SafeCast<TType extends ObjectType | PrimitiveTypeNames> =
    TType extends ObjectType<infer TResult> ? TResult :
    TType extends PrimitiveTypeNames ? PrimitiveTypesMap[TType] :
    never;

/**
 * Casts an object to the provided type, if that object is of that type.
 * @param targetType Type to cast to.
 * @param obj Object to cast.
 * @returns If type `TType` exists in the prototype chain of `obj` or if `obj` is `typeof` `TType`,
 * then `obj` cast to `TType`, otherwise `null`.
 * */
export function dynamicCast<TType extends ObjectType | PrimitiveTypeNames>(
    targetType: TType,
    obj: any):
    Nullable<SafeCast<TType>>
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
export function isOfType<TType extends ObjectType | PrimitiveTypeNames>(
    targetType: TType,
    obj: any):
    obj is SafeCast<TType>
{
    return typeof targetType === 'string' ?
        isPrimitiveOfType(reinterpretCast<PrimitiveTypeNames>(targetType), obj) :
        isInstanceOfType(reinterpretCast<ObjectType>(targetType), obj);
}
