import { ObjectType, AbstractObjectType } from '../types/object-type';
import { PrimitiveTypeNames } from '../types/primitive';
import { TypeInstance } from '../types/type-instance';
import { Nullable } from '../types/nullable';
import { Undefinable } from '../types/undefinable';
import { Optional } from '../types/optional';
import { DynamicCastType } from '../functions/dynamic-cast';

/** Represents an object mapper. */
export interface IMapper {
    /**
     * Checks whether or not a mapping from `sourceType` to `destinationType` exists.
     * @param sourceType Source type to check.
     * @param destinationType Destination type to check.
     * @returns `true`, if mapping exists, otherwise `false`.
     */
    has<
        TSource extends PrimitiveTypeNames | ObjectType | AbstractObjectType,
        TDestination extends PrimitiveTypeNames | ObjectType | AbstractObjectType>(
        sourceType: TSource,
        destinationType: TDestination):
        boolean;

    /**
     * Maps an object to the destination type.
     * @param destinationType Destination type to map to.
     * @param source An object to map.
     * @returns A mapping result.
     */
    map<TDestination extends PrimitiveTypeNames | object>(
        destinationType: DynamicCastType<TDestination>,
        source: any):
        TypeInstance<DynamicCastType<TDestination>>;

    /**
     * Maps a nullable object to the destination type.
     * @param destinationType Destination type to map to.
     * @param source An object to map.
     * @returns A nullable mapping result.
     */
    mapNullable<TDestination extends PrimitiveTypeNames | object>(
        destinationType: DynamicCastType<TDestination>,
        source: any):
        Nullable<TypeInstance<DynamicCastType<TDestination>>>;

    /**
     * Maps an undefinable object to the destination type.
     * @param destinationType Destination type to map to.
     * @param source An object to map.
     * @returns An undefinable mapping result.
     */
    mapUndefinable<TDestination extends PrimitiveTypeNames | object>(
        destinationType: DynamicCastType<TDestination>,
        source: any):
        Undefinable<TypeInstance<DynamicCastType<TDestination>>>;

    /**
     * Maps an optional object to the destination type.
     * @param destinationType Destination type to map to.
     * @param source An object to map.
     * @returns An optional mapping result.
     */
    mapOptional<TDestination extends PrimitiveTypeNames | object>(
        destinationType: DynamicCastType<TDestination>,
        source: any):
        Optional<TypeInstance<DynamicCastType<TDestination>>>;

    /**
     * Maps a range of objects to the destination type.
     * @param destinationType Destination type to map to.
     * @param source A range of objects to map.
     * @returns A range mapping result.
     */
    mapRange<TDestination extends PrimitiveTypeNames | object>(
        destinationType: DynamicCastType<TDestination>,
        source: Iterable<any>):
        TypeInstance<DynamicCastType<TDestination>>[];
}
