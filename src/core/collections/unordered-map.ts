import { MapEntry, makeMapEntry } from './map-entry';
import { IReadonlyUnorderedMap } from './readonly-unordered-map.interface';
import { reinterpretCast } from '../functions/reinterpret-cast';
import { Assert } from '../functions/assert';
import { DeepReadonly } from '../types/deep-readonly';
import { isUndefined } from '../functions/is-undefined';
import { Stringifier } from '../types/stringifier';
import { Nullable } from '../types/nullable';

/** Represents a map, or dictionary, data structure. */
export class UnorderedMap<TKey, TValue>
    implements
    IReadonlyUnorderedMap<TKey, TValue>
{
    public get length(): number
    {
        return this._map.size;
    }

    public get isEmpty(): boolean
    {
        return this.length === 0;
    }

    public readonly stringifier: Stringifier<TKey>;

    private readonly _map: Map<string, MapEntry<TKey, TValue>>;

    /**
     * Creates a new UnorderedMap object.
     * @param stringifier An optional, custom stringifier used for key comparison.
     */
    public constructor(
        stringifier: Stringifier<TKey> = k => reinterpretCast<object>(k).toString())
    {
        this.stringifier = Assert.IsDefined(stringifier, 'stringifier');
        this._map = new Map<string, MapEntry<TKey, TValue>>();
    }

    public get(key: DeepReadonly<TKey>): TValue
    {
        const stringified = this.stringifier(key);
        const entry = this._map.get(stringified);

        if (isUndefined(entry))
            throw new Error(`unordered map entry with key ${JSON.stringify(key)} [${stringified}] doesn't exist.`);

        return entry.value;
    }

    public tryGet(key: DeepReadonly<TKey>): Nullable<TValue>
    {
        const stringified = this.stringifier(key);
        const entry = this._map.get(stringified);
        return isUndefined(entry) ? null : entry.value;
    }

    public has(key: DeepReadonly<TKey>): boolean
    {
        const stringified = this.stringifier(key);
        return this._map.has(stringified);
    }

    /**
     * Returns a value associated with the provided key, or creates a new entry with a default value.
     * @param key Key to get a value for.
     * @param defaultValueProvider A function providing a default value, called when the key doesn't exist in order to create a new entry.
     * @returns A value associated with the provided key.
     */
    public getOrAdd(key: DeepReadonly<TKey>, defaultValueProvider: () => TValue): TValue
    {
        const stringified = this.stringifier(key);
        let entry = this._map.get(stringified);

        if (isUndefined(entry))
        {
            entry = makeMapEntry(key, defaultValueProvider());
            this._map.set(stringified, entry);
        }
        return entry.value;
    }

    /**
     * Adds a new key-value pair to the map.
     * @param key Key to add.
     * @param value Value associated with the `key`.
     * @throws An `Error`, if the key already exists.
     */
    public add(key: DeepReadonly<TKey>, value: TValue): void
    {
        const stringified = this.stringifier(key);

        if (this._map.has(stringified))
            throw new Error(`unordered map entry with key ${JSON.stringify(key)} [${stringified}] already exists.`);

        this._map.set(stringified, makeMapEntry(key, value));
    }

    /**
     * Adds a new key-value pair to the map.
     * @param key Key to add.
     * @param value Value associated with the `key`.
     * @returns `true`, if the key-value pair has been added successfully, or `false`, if the key already exists.
     */
    public tryAdd(key: DeepReadonly<TKey>, value: TValue): boolean
    {
        const stringified = this.stringifier(key);

        if (this._map.has(stringified))
            return false;

        this._map.set(stringified, makeMapEntry(key, value));
        return true;
    }

    /**
     * Set a key-value pair in the map, either adding a new entry, or replacing an existing one.
     * @param key Key to set.
     * @param value Value associated with the `key`.
     */
    public set(key: DeepReadonly<TKey>, value: TValue): void
    {
        const stringified = this.stringifier(key);
        this._map.set(stringified, makeMapEntry(key, value));
    }

    /**
     * Removes a key-value pair associated with the provided key from the map.
     * @param key Key to remove.
     * @throws An `Error`, if the key doesn't exist.
     */
    public delete(key: DeepReadonly<TKey>): void
    {
        const stringified = this.stringifier(key);

        if (!this._map.delete(stringified))
            throw new Error(`unordered map entry with key ${JSON.stringify(key)} [${stringified}] doesn't exist.`);
    }

    /**
     * Removes a key-value pair associated with the provided key from the map.
     * @param key Key to remove.
     * @returns `true`, if the key-value pair has been removed successfully, or `false`, if the key doesn't exist.
     */
    public tryDelete(key: DeepReadonly<TKey>): boolean
    {
        const stringified = this.stringifier(key);
        return this._map.delete(stringified);
    }

    /**
     * Removes all entries from the map.
     */
    public clear(): void
    {
        this._map.clear();
    }

    public* keys(): Iterable<DeepReadonly<TKey>>
    {
        for (const entry of this._map.values())
            yield entry.key;
    }

    public* values(): Iterable<TValue>
    {
        for (const entry of this._map.values())
            yield entry.value;
    }

    public entries(): Iterable<MapEntry<TKey, TValue>>
    {
        return this._map.values();
    }

    public [Symbol.iterator](): IterableIterator<MapEntry<TKey, TValue>>
    {
        return this._map.values();
    }
}
