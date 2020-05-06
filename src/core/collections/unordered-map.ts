import { MapEntry, makeMapEntry } from './map-entry';
import { IReadonlyUnorderedMap } from './readonly-unordered-map.interface';
import { reinterpretCast } from '../functions/reinterpret-cast';
import { Assert } from '../functions/assert';
import { DeepReadonly } from '../types/deep-readonly';
import { isUndefined } from '../functions/is-undefined';
import { Stringifier } from '../types/stringifier';
import { Nullable } from '../types/nullable';

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

    public constructor(
        stringifier: Stringifier<TKey> = k => reinterpretCast<object>(k).toString())
    {
        this.stringifier = Assert.IsDefined(stringifier, 'stringifier');
        this._map = new Map<string, MapEntry<TKey, TValue>>();
    }

    public get(key: DeepReadonly<TKey>): TValue
    {
        const stringifiedKey = this.stringifier(key);
        const entry = this._map.get(stringifiedKey);

        if (isUndefined(entry))
            throw new Error(`unordered map entry with key ${JSON.stringify(key)} [${stringifiedKey}] doesn't exist.`);

        return entry.value;
    }

    public tryGet(key: DeepReadonly<TKey>): Nullable<TValue>
    {
        const stringifiedKey = this.stringifier(key);
        const entry = this._map.get(stringifiedKey);
        return isUndefined(entry) ? null : entry.value;
    }

    public has(key: DeepReadonly<TKey>): boolean
    {
        const stringifiedKey = this.stringifier(key);
        return this._map.has(stringifiedKey);
    }

    public getOrAdd(key: DeepReadonly<TKey>, defaultValueProvider: () => TValue): TValue
    {
        const stringifiedKey = this.stringifier(key);
        let entry = this._map.get(stringifiedKey);

        if (isUndefined(entry))
        {
            entry = makeMapEntry(key, defaultValueProvider());
            this._map.set(stringifiedKey, entry);
        }
        return entry.value;
    }

    public add(key: DeepReadonly<TKey>, value: TValue): void
    {
        const stringifiedKey = this.stringifier(key);

        if (this._map.has(stringifiedKey))
            throw new Error(`unordered map entry with key ${JSON.stringify(key)} [${stringifiedKey}] already exists.`);

        this._map.set(stringifiedKey, makeMapEntry(key, value));
    }

    public tryAdd(key: DeepReadonly<TKey>, value: TValue): boolean
    {
        const stringifiedKey = this.stringifier(key);

        if (this._map.has(stringifiedKey))
            return false;

        this._map.set(stringifiedKey, makeMapEntry(key, value));
        return true;
    }

    public set(key: DeepReadonly<TKey>, value: TValue): void
    {
        const stringifiedKey = this.stringifier(key);
        this._map.set(stringifiedKey, makeMapEntry(key, value));
    }

    public delete(key: DeepReadonly<TKey>): void
    {
        const stringifiedKey = this.stringifier(key);

        if (!this._map.delete(stringifiedKey))
            throw new Error(`unordered map entry with key ${JSON.stringify(key)} [${stringifiedKey}] doesn't exist.`);
    }

    public tryDelete(key: DeepReadonly<TKey>): boolean
    {
        const stringifiedKey = this.stringifier(key);
        return this._map.delete(stringifiedKey);
    }

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
