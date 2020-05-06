import { UnorderedMap } from './unordered-map';
import { MapEntry } from './map-entry';
import { IReadonlyTableIndex } from './readonly-table-index.interface';
import { KeySelector } from './key-selector';
import { Stringifier } from '../stringifier';
import { DeepReadonly, toDeepReadonly } from '../types/deep-readonly';
import { Nullable } from '../types';
import { isNull } from '../functions/is-null';

export class TableIndex<TKey, TEntity>
    implements
    IReadonlyTableIndex<TKey, TEntity>
{
    public get length(): number
    {
        return this._map.length;
    }

    public get keyStringifier(): Stringifier<TKey>
    {
        return this._map.stringifier;
    }

    public readonly name: string;
    public readonly keySelector: KeySelector<TKey, TEntity>;

    private readonly _map: UnorderedMap<TKey, TEntity>;

    public constructor(
        name: string,
        keySelector: KeySelector<TKey, TEntity>,
        keyStringifier?: Stringifier<TKey>)
    {
        this.name = name;
        this.keySelector = keySelector;
        this._map = new UnorderedMap<TKey, TEntity>(keyStringifier);
    }

    public get(key: DeepReadonly<TKey>): TEntity
    {
        const result = this.tryGet(key);

        if (isNull(result))
            throw new Error(`entity with key ${JSON.stringify(key)} doesn't exist in index '${this.name}'`);

        return result;
    }

    public tryGet(key: DeepReadonly<TKey>): Nullable<TEntity>
    {
        return this._map.tryGet(key);
    }

    public* getRange(keys: Iterable<DeepReadonly<TKey>>): Iterable<TEntity>
    {
        for (const key of keys)
            yield this.get(key);
    }

    public* tryGetRange(keys: Iterable<DeepReadonly<TKey>>): Iterable<TEntity>
    {
        for (const key of keys)
        {
            const entity = this.tryGet(key);
            if (!isNull(entity))
                yield entity;
        }
    }

    public getEntityKey(entity: DeepReadonly<TEntity>): DeepReadonly<TKey>
    {
        return this.keySelector(entity);
    }

    public has(entity: DeepReadonly<TEntity>): boolean
    {
        const key = this.getEntityKey(entity);
        return this._map.has(key);
    }

    public hasKey(key: DeepReadonly<TKey>): boolean
    {
        return this._map.has(key);
    }

    public add(entity: TEntity): void
    {
        const key = this.getEntityKey(toDeepReadonly(entity));

        if (!this._map.tryAdd(key, entity))
            throw new Error(`index '${this.name}' already contains an entity with key ${JSON.stringify(key)}.`);
    }

    public tryAdd(entity: TEntity): boolean
    {
        const key = this.getEntityKey(toDeepReadonly(entity));
        return this._map.tryAdd(key, entity);
    }

    public delete(entity: DeepReadonly<TEntity>): void
    {
        const key = this.getEntityKey(entity);

        if (!this._map.tryDelete(key))
            throw new Error(`index '${this.name}' doesn't contain an entity with key ${JSON.stringify(key)}.`);
    }

    public deleteByKey(key: DeepReadonly<TKey>): void
    {
        if (!this._map.tryDelete(key))
            throw new Error(`index '${this.name}' doesn't contain an entity with key ${JSON.stringify(key)}.`);
    }

    public clear(): void
    {
        this._map.clear();
    }

    public keys(): Iterable<DeepReadonly<TKey>>
    {
        return this._map.keys();
    }

    public values(): Iterable<TEntity>
    {
        return this._map.values();
    }

    public entities(): Iterable<MapEntry<TKey, TEntity>>
    {
        return this._map.entries();
    }

    public [Symbol.iterator](): IterableIterator<MapEntry<TKey, TEntity>>
    {
        return this._map[Symbol.iterator]();
    }
}
