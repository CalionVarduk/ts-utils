import { MapEntry } from './map-entry';
import { DeepReadonly } from '../types/deep-readonly';
import { Nullable } from '../types/nullable';
import { Stringifier } from '../types/stringifier';
import { KeySelector } from './key-selector';
import { IReadonlyCollection } from './readonly-collection.interface';

/** Represents a readonly keyed collection lookup of entities. */
export interface IKeyedCollectionLookup<TKey, TEntity>
    extends
    IReadonlyCollection<MapEntry<TKey, TEntity>>
{
    /** Specifies the lookup's name. */
    readonly name: string;

    /** Specifies whether or not the lookup is empty. */
    readonly isEmpty: boolean;

    /** Specifies lookup's key stringifier used for key comparison. */
    readonly keyStringifier: Stringifier<TKey>;

    /** Specifies lookup's key selector used for identifying entities. */
    readonly keySelector: KeySelector<TKey, TEntity>;

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
     * Returns a key associated with the provided entity.
     * @param entity An entity to get the key for.
     * @returns A key associated with the provided entity.
     */
    getEntityKey(entity: DeepReadonly<TEntity>): DeepReadonly<TKey>;

    /**
     * Checks whether or not an entity exists in the lookup.
     * @param entity Entity to check.
     * @returns `true`, if entity exists, otherwise `false`.
     */
    has(entity: DeepReadonly<TEntity>): boolean;

    /**
     * Checks whether or not a key exists in the lookup.
     * @param key Key to check.
     * @returns `true`, if key exists, otherwise `false`.
     */
    hasKey(key: DeepReadonly<TKey>): boolean;

    /**
     * Creates an iterable containing all lookup keys.
     * @returns An iterable containing all lookup keys.
     */
    keys(): Iterable<DeepReadonly<TKey>>;

    /**
     * Creates an iterable containing all lookup entities.
     * @returns An iterable containing all lookup entities.
     */
    values(): Iterable<TEntity>;
}
