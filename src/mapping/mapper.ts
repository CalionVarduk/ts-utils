import { IMapper } from './mapper.interface';
import { ObjectType, PrimitiveTypeNames, TypeInstance, Nullable, Undefinable, Optional, AbstractObjectType } from '../types';
import { Mapping } from './mapping';
import { Assert, isUndefined, isNull, isDefined, DynamicCastType } from '../functions';
import { Iteration } from '../collections';

/** Represents an object mapper. */
export class Mapper
    implements
    IMapper
{
    private readonly _mappings: Map<
        ObjectType | AbstractObjectType | PrimitiveTypeNames,
        Map<ObjectType | AbstractObjectType | PrimitiveTypeNames, Mapping<any, any>>>;

    /**
     * Creates a new Mapper object.
     */
    public constructor()
    {
        this._mappings = new Map<
            ObjectType | AbstractObjectType | PrimitiveTypeNames,
            Map<ObjectType | AbstractObjectType | PrimitiveTypeNames, Mapping<any, any>>>();
    }

    public has<
        TSource extends PrimitiveTypeNames | ObjectType | AbstractObjectType,
        TDestination extends PrimitiveTypeNames | ObjectType | AbstractObjectType>(
        sourceType: TSource,
        destinationType: TDestination):
        boolean
    {
        const entry = this._mappings.get(sourceType);
        return !isUndefined(entry) && entry.has(destinationType);
    }

    /**
     * Registers a mapping function, that maps objects of `sourceType` to `destinationType`.
     * @param sourceType Source type to map from.
     * @param destinationType Destination type to map to.
     * @param mapping A mapping function.
     * @throws An `Error`, when mapping from `sourceType` to `destinationType` already exists.
     * @returns `this`.
     */
    public add<
        TSource extends PrimitiveTypeNames | ObjectType | AbstractObjectType,
        TDestination extends PrimitiveTypeNames | ObjectType | AbstractObjectType>(
        sourceType: TSource,
        destinationType: TDestination,
        mapping: Mapping<TypeInstance<TSource>, TypeInstance<TDestination>>):
        this
    {
        let entry = this._mappings.get(sourceType);
        if (isUndefined(entry))
        {
            entry = new Map<ObjectType | PrimitiveTypeNames, Mapping<any, any>>();
            entry.set(destinationType, mapping);
            this._mappings.set(sourceType, entry);
        }
        else
        {
            Assert.False(entry.has(destinationType), `mapping from '${sourceType}' to '${destinationType}' has already been defined`);
            entry.set(destinationType, mapping);
        }
        return this;
    }

    public map<TDestination extends PrimitiveTypeNames | object>(
        destinationType: DynamicCastType<TDestination>,
        source: any):
        TypeInstance<DynamicCastType<TDestination>>
    {
        const typeOfSource = typeof source;

        const sourceTypeKey = typeOfSource === 'object' && !isNull(source) && source.constructor !== Object.constructor ?
            source.constructor :
            typeOfSource;

        const sourceMappings = this._mappings.get(sourceTypeKey);
        if (isUndefined(sourceMappings))
            throw new Error(`mapping from '${sourceTypeKey}' to '${destinationType}' is undefined`);

        const mapping = sourceMappings.get(destinationType);
        if (isUndefined(mapping))
            throw new Error(`mapping from '${sourceTypeKey}' to '${destinationType}' is undefined`);

        return mapping(source, this);
    }

    public mapNullable<TDestination extends PrimitiveTypeNames | object>(
        destinationType: DynamicCastType<TDestination>,
        source: any):
        Nullable<TypeInstance<DynamicCastType<TDestination>>>
    {
        return isNull(source) ? null : this.map(destinationType, source);
    }

    public mapUndefinable<TDestination extends PrimitiveTypeNames | object>(
        destinationType: DynamicCastType<TDestination>,
        source: any):
        Undefinable<TypeInstance<DynamicCastType<TDestination>>>
    {
        return isUndefined(source) ? void(0) : this.map(destinationType, source);
    }

    public mapOptional<TDestination extends PrimitiveTypeNames | object>(
        destinationType: DynamicCastType<TDestination>,
        source: any):
        Optional<TypeInstance<DynamicCastType<TDestination>>>
    {
        return isDefined(source) ? this.map(destinationType, source) : source;
    }

    public mapRange<TDestination extends PrimitiveTypeNames | object>(
        destinationType: DynamicCastType<TDestination>,
        source: Iterable<any>):
        TypeInstance<DynamicCastType<TDestination>>[]
    {
        return Iteration.ToArray(
            Iteration.Map(source, s => this.map(destinationType, s)));
    }
}
