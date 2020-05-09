import { MapEntry } from './map-entry';
import { DeepReadonly } from '../types/deep-readonly';
import { Stringifier } from '../types/stringifier';
import { Nullable } from '../types/nullable';

/** Represents a readonly map, or dictionary, data structure. */
export interface IReadonlyUnorderedMap<TKey, TValue>
    extends
    Iterable<MapEntry<TKey, TValue>>
{
    /** Specifies the map's length. */
    readonly length: number;

    /** Specifies whether or not the map is empty. */
    readonly isEmpty: boolean;

    /** Specifies map's key stringifier used for key comparison. */
    readonly stringifier: Stringifier<TKey>;

    /**
     * Returns a value associated with the provided key.
     * @param key Key to get a value for.
     * @throws An `Error`, when `key` doesn't exist.
     * @returns A value associated with the provided key.
     */
    get(key: DeepReadonly<TKey>): TValue;

    /**
     * Returns a value associated with the provided key, or `null`, if the key doesn't exist.
     * @param key Key to get a value for.
     * @returns A value associated with the provided key, if it exists, otherwise `null`.
     */
    tryGet(key: DeepReadonly<TKey>): Nullable<TValue>;

    /**
     * Checks whether or not a key exists in the map.
     * @param key Key to check.
     * @returns `true`, if key exists, otherwise `false`.
     */
    has(key: DeepReadonly<TKey>): boolean;

    /**
     * Creates an iterable containing all map keys.
     * @returns An iterable containing all map keys.
     */
    keys(): Iterable<DeepReadonly<TKey>>;

    /**
     * Creates an iterable containing all map values.
     * @returns An iterable containing all map values.
     */
    values(): Iterable<TValue>;

    /**
     * Creates an iterable containing all map key-value pairs.
     * @returns An iterable containing all map key-value pairs.
     */
    entries(): Iterable<MapEntry<TKey, TValue>>;
}
