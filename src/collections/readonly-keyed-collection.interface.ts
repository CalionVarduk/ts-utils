import { IKeyedCollectionLookup } from './keyed-collection-lookup.interface';
import { MapEntry } from './map-entry';
import { DeepReadonly } from '../types/deep-readonly';
import { Nullable } from '../types';
import { IReadonlyCollection } from './readonly-collection.interface';

/** Represents a readonly keyed collection of entities. */
export interface IReadonlyKeyedCollection<TKey, TEntity>
    extends
    IReadonlyCollection<MapEntry<TKey, TEntity>>
{
    /** Specifies the collection's name. */
    readonly name: string;

    /** Specifies whether or not the collection is empty. */
    readonly isEmpty: boolean;

    /** Specifies the collection's primary lookup. */
    readonly primaryLookup: IKeyedCollectionLookup<TKey, TEntity>;

    /** Specifies the amount of additional lookups. */
    readonly lookupCount: number;

    /**
     * Returns an entity associated with the provided key.
     * @param key Key to get an entity for.
     * @throws An `Error`, when `key` doesn't exist.
     * @returns An entity associated with the provided key.
     */
    get(key: DeepReadonly<TKey>): TEntity;

    /**
     * Returns an entity associated with the provided key.
     * @param key Key to get an entity for.
     * @returns An entity associated with the provided key, or `null`, if key doesn't exist.
     */
    tryGet(key: DeepReadonly<TKey>): Nullable<TEntity>;

    /**
     * Returns entities associated with provided keys.
     * @param keys Keys to get entities for.
     * @throws An `Error`, if any of the provided keys doesn't exist.
     * @returns An iterable containing all entities associated with provided keys.
     */
    getRange(keys: Iterable<DeepReadonly<TKey>>): Iterable<TEntity>;

    /**
     * Returns entities associated with provided keys.
     * @param keys Keys to get entities for.
     * @returns An iterable containing all entities associated with provided keys, with non-existing keys being ignored.
     */
    tryGetRange(keys: Iterable<DeepReadonly<TKey>>): Iterable<TEntity>;

    /**
     * Checks whether or not an entity exists in the collection.
     * @param entity Entity to check.
     * @returns `true`, if entity exists, otherwise `false`.
     */
    has(entity: DeepReadonly<TEntity>): boolean;

    /**
     * Checks whether or not a key exists in the collection.
     * @param key Key to check.
     * @returns `true`, if key exists, otherwise `false`.
     */
    hasKey(key: DeepReadonly<TKey>): boolean;

    /**
     * Creates an iterable containing all collection entities.
     * @returns An iterable containing all collection entities.
     */
    entities(): Iterable<TEntity>;

    /**
     * Returns an additional lookup associated with the provided name.
     * @param name Name to get an additional lookup for.
     * @throws An `Error`, when lookup with `name` doesn't exist.
     * @returns An additional lookup associated with the provided name.
     */
    getLookup<TLookupKey>(name: string): IKeyedCollectionLookup<TLookupKey, TEntity>;

    /**
     * Returns an additional lookup associated with the provided name.
     * @param name Name to get an additional lookup for.
     * @returns An additional lookup associated with the provided name, or `null`, if lookup doesn't exist.
     */
    tryGetLookup<TLookupKey>(name: string): Nullable<IKeyedCollectionLookup<TLookupKey, TEntity>>;

    /**
     * Checks whether or not an additional lookup with the provided name exists in the collection.
     * @param name Lookup name to check.
     * @returns `true`, if additional lookup with the provided name exists, otherwise `false`.
     */
    hasLookup(name: string): boolean;

    /**
     * Creates an iterable containing all additional lookup names.
     * @returns An iterable containing all additional lookup names.
     */
    lookupNames(): Iterable<string>;
}
