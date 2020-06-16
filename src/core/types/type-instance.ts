import { ObjectType } from './object-type';
import { PrimitiveTypeNames, PrimitiveTypesMap } from './primitive';

/** TypeInstance type alias. */
export type TypeInstance<TType extends ObjectType | PrimitiveTypeNames> =
    TType extends ObjectType<infer TResult> ? TResult :
    TType extends PrimitiveTypeNames ? PrimitiveTypesMap[TType] :
    never;
