import { ObjectType, AbstractObjectType } from './object-type';
import { PrimitiveTypeNames, PrimitiveTypesMap } from './primitive';

/** TypeInstance type alias. */
export type TypeInstance<TType extends ObjectType | AbstractObjectType | PrimitiveTypeNames> =
    TType extends ObjectType<infer TResult> ? TResult :
    TType extends AbstractObjectType<infer TAbstractResult> ? TAbstractResult :
    TType extends PrimitiveTypeNames ? PrimitiveTypesMap[TType] :
    never;
