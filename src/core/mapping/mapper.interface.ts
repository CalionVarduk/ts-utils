import { ObjectType } from '../types/object-type';
import { PrimitiveTypeNames } from '../types/primitive';
import { TypeInstance } from '../types/type-instance';
import { Nullable } from '../types/nullable';
import { Undefinable } from '../types/undefinable';
import { Optional } from '../types/optional';

/** Represents an object mapper. */
export interface IMapper {
    /**
     * Checks whether or not a mapping from `sourceType` to `destinationType` exists.
     * @param sourceType Source type to check.
     * @param destinationType Destination type to check.
     * @returns `true`, if mapping exists, otherwise `false`.
     */
    has<TSource extends PrimitiveTypeNames | ObjectType, TDestination extends PrimitiveTypeNames | ObjectType>(
        sourceType: TSource,
        destinationType: TDestination):
        boolean;

    /**
     * Maps an object to the destination type.
     * @param destinationType Destination type to map to.
     * @param source An object to map.
     * @returns A mapping result.
     */
    map<TDestination extends PrimitiveTypeNames | ObjectType>(
        destinationType: TDestination,
        source: any):
        TypeInstance<TDestination>;

    /**
     * Maps a nullable object to the destination type.
     * @param destinationType Destination type to map to.
     * @param source An object to map.
     * @returns A nullable mapping result.
     */
    mapNullable<TDestination extends PrimitiveTypeNames | ObjectType>(
        destinationType: TDestination,
        source: any):
        Nullable<TypeInstance<TDestination>>;

    /**
     * Maps an undefinable object to the destination type.
     * @param destinationType Destination type to map to.
     * @param source An object to map.
     * @returns An undefinable mapping result.
     */
    mapUndefinable<TDestination extends PrimitiveTypeNames | ObjectType>(
        destinationType: TDestination,
        source: any):
        Undefinable<TypeInstance<TDestination>>;

    /**
     * Maps an optional object to the destination type.
     * @param destinationType Destination type to map to.
     * @param source An object to map.
     * @returns An optional mapping result.
     */
    mapOptional<TDestination extends PrimitiveTypeNames | ObjectType>(
        destinationType: TDestination,
        source: any):
        Optional<TypeInstance<TDestination>>;

    /**
     * Maps a range of objects to the destination type.
     * @param destinationType Destination type to map to.
     * @param source A range of objects to map.
     * @returns A range mapping result.
     */
    mapRange<TDestination extends PrimitiveTypeNames | ObjectType>(
        destinationType: TDestination,
        source: Iterable<any>):
        TypeInstance<TDestination>[];
}
