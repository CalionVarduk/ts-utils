import { TableIndex } from './table-index';
import { UnorderedMap } from './unordered-map';
import { MapEntry, makeMapEntry } from './map-entry';
import { IReadonlyTable } from './readonly-table.interface';
import { IReadonlyTableIndex } from './readonly-table-index.interface';
import { KeySelector } from './key-selector';
import { Stringifier } from '../stringifier';
import { Assert } from '../functions/assert';
import { DeepReadonly, toDeepReadonly } from '../types/deep-readonly';
import { Nullable } from '../types/nullable';
import { isNull } from '../functions/is-null';
import { Iteration } from './iteration';
import { deepReadonlyCast } from '../functions';

function decoratePrimaryKeyName(tableName: string): string
{
    return `PK_${tableName}`;
}

function extractTableName<TKey, TEntity>(primaryKey: IReadonlyTableIndex<TKey, TEntity>): string
{
    return primaryKey.name.substr(3);
}

function decorateIndexName(tableName: string, indexName: string): string
{
    return `IX_${tableName}_${indexName}`;
}

function extractIndexName<TKey, TEntity>(tableName: string, index: IReadonlyTableIndex<TKey, TEntity>): string
{
    return index.name.substr(tableName.length + 4);
}

function buildEntityAdditionErrorMsg<TEntity>(
    tableName: string,
    entity: TEntity,
    invalidIndexes: ReadonlyArray<TableIndex<any, TEntity>>):
    string
{
    return `failed to add an entity ${JSON.stringify(entity)} to table '${tableName}' due to conflicting indexes:
        ${invalidIndexes.map(i => `[${i.name}] key: ${JSON.stringify(i.getEntityKey(toDeepReadonly(entity)))}`).join('\n')}`;
}

export class Table<TKey, TEntity>
    implements
    IReadonlyTable<TKey, TEntity>
{
    public get name(): string
    {
        return extractTableName(this._primaryKey);
    }

    public get length(): number
    {
        return this._primaryKey.length;
    }

    public get primaryKey(): IReadonlyTableIndex<TKey, TEntity>
    {
        return this._primaryKey;
    }

    public get indexCount(): number
    {
        return this._indexes.length;
    }

    private readonly _primaryKey: TableIndex<TKey, TEntity>;
    private readonly _indexes: UnorderedMap<string, TableIndex<any, TEntity>>;

    public constructor(
        name: string,
        primaryKeySelector: KeySelector<TKey, TEntity>,
        primaryKeyStringifier?: Stringifier<TKey>)
    {
        this._primaryKey = new TableIndex<TKey, TEntity>(
            decoratePrimaryKeyName(Assert.IsNotEmpty(name, 'name')),
            primaryKeySelector,
            primaryKeyStringifier);

        this._indexes = new UnorderedMap<string, TableIndex<any, TEntity>>();
    }

    public get(key: DeepReadonly<TKey>): TEntity
    {
        return this._primaryKey.get(key);
    }

    public tryGet(key: DeepReadonly<TKey>): Nullable<TEntity>
    {
        return this._primaryKey.tryGet(key);
    }

    public getRange(keys: Iterable<DeepReadonly<TKey>>): Iterable<TEntity>
    {
        return this._primaryKey.getRange(keys);
    }

    public tryGetRange(keys: Iterable<DeepReadonly<TKey>>): Iterable<TEntity>
    {
        return this._primaryKey.tryGetRange(keys);
    }

    public has(entity: DeepReadonly<TEntity>): boolean
    {
        return this._primaryKey.has(entity);
    }

    public hasKey(key: DeepReadonly<TKey>): boolean
    {
        return this._primaryKey.hasKey(key);
    }

    public add(entity: TEntity): void
    {
        if (this.indexCount > 0)
        {
            const invalidIndexes: TableIndex<any, TEntity>[] = [];

            if (this._primaryKey.has(toDeepReadonly(entity)))
                invalidIndexes.push(this._primaryKey);

            for (const index of this._indexes.values())
                if (index.has(toDeepReadonly(entity)))
                    invalidIndexes.push(index);

            if (invalidIndexes.length !== 0)
                throw new Error(buildEntityAdditionErrorMsg(this.name, entity, invalidIndexes));

            this._primaryKey.add(entity);
            for (const index of this._indexes.values())
                index.add(entity);
        }
        else if (!this._primaryKey.tryAdd(entity))
            throw new Error(buildEntityAdditionErrorMsg(this.name, entity, [this._primaryKey]));
    }

    public addRange(entities: Iterable<TEntity>): void
    {
        if (this.indexCount > 0)
        {
            const indexes = Iteration.ToArray(
                Iteration.Concat(
                    Iteration.ToIterable<TableIndex<any, TEntity>>(this._primaryKey),
                    this._indexes.values()));

            for (const index of indexes)
                if (Iteration.HasDuplicates(
                    Iteration.Map(entities, e => index.getEntityKey(toDeepReadonly(e))),
                    index.keyStringifier))
                    throw new Error(`can't add entities with duplicated index '${index.name}' keys to table '${this.name}'`);

            for (const entity of entities)
            {
                const invalidIndexes: TableIndex<any, TEntity>[] = [];

                for (const index of indexes)
                    if (index.has(toDeepReadonly(entity)))
                        invalidIndexes.push(index);

                if (invalidIndexes.length !== 0)
                    throw new Error(buildEntityAdditionErrorMsg(this.name, entity, invalidIndexes));
            }

            for (const entity of entities)
                for (const index of indexes)
                    index.add(entity);
        }
        else
        {
            if (Iteration.HasDuplicates(
                Iteration.Map(entities, e => deepReadonlyCast(this._primaryKey.getEntityKey(toDeepReadonly(e)))),
                this._primaryKey.keyStringifier))
                throw new Error(`can't add entities with duplicated index '${this._primaryKey.name}' keys to table '${this.name}'`);

            for (const entity of entities)
                if (this._primaryKey.has(toDeepReadonly(entity)))
                    throw new Error(buildEntityAdditionErrorMsg(this.name, entity, [this._primaryKey]));

            for (const entity of entities)
                this._primaryKey.add(entity);
        }
    }

    public tryAdd(entity: TEntity): boolean
    {
        if (this.indexCount > 0)
        {
            if (this._primaryKey.has(toDeepReadonly(entity)) ||
                Iteration.Some(this._indexes.values(), i => i.has(toDeepReadonly(entity))))
                return false;

            this._primaryKey.add(entity);
            for (const index of this._indexes.values())
                index.add(entity);
        }
        else if (!this._primaryKey.tryAdd(entity))
            return false;

        return true;
    }

    public tryAddRange(entities: Iterable<TEntity>): Iterable<TEntity>
    {
        const added: TEntity[] = [];

        if (this.indexCount > 0)
        {
            const indexes = Iteration.ToArray(this._indexes.values());

            for (const entity of entities)
            {
                if (this._primaryKey.has(toDeepReadonly(entity)) ||
                    Iteration.Some(indexes, i => i.has(toDeepReadonly(entity))))
                    continue;

                this._primaryKey.add(entity);
                for (const index of indexes)
                    index.add(entity);

                added.push(entity);
            }
        }
        else
        {
            for (const entity of entities)
                if (this._primaryKey.tryAdd(entity))
                    added.push(entity);
        }
        return added;
    }

    public delete(entity: DeepReadonly<TEntity>): TEntity
    {
        const key = this._primaryKey.getEntityKey(entity);
        return this.deleteByKey(key);
    }

    public deleteByKey(key: DeepReadonly<TKey>): TEntity
    {
        const deleted = this._primaryKey.get(key);

        this._primaryKey.deleteByKey(key);
        for (const index of this._indexes.values())
            index.delete(toDeepReadonly(deleted));

        return deleted;
    }

    public deleteRange(entities: Iterable<DeepReadonly<TEntity>>): Iterable<TEntity>
    {
        const keys = Iteration.Map(entities, e => this._primaryKey.getEntityKey(e));
        return this.deleteRangeByKeys(keys);
    }

    public deleteRangeByKeys(keys: Iterable<DeepReadonly<TKey>>): Iterable<TEntity>
    {
        const deleted = Iteration.ToArray(
            Iteration.Map(keys, k => makeMapEntry(k, this._primaryKey.get(k))));

        const indexes = Iteration.ToArray(this._indexes.values());

        for (const d of deleted)
        {
            this._primaryKey.deleteByKey(d.key);
            for (const index of indexes)
                index.delete(toDeepReadonly(d.value));
        }
        return Iteration.Map(deleted, d => d.value);
    }

    public tryDelete(entity: DeepReadonly<TEntity>): Nullable<TEntity>
    {
        const key = this._primaryKey.getEntityKey(entity);
        return this.tryDeleteByKey(key);
    }

    public tryDeleteByKey(key: DeepReadonly<TKey>): Nullable<TEntity>
    {
        const deleted = this._primaryKey.tryGet(key);

        if (isNull(deleted))
            return null;

        this._primaryKey.deleteByKey(key);
        for (const index of this._indexes.values())
            index.delete(toDeepReadonly(deleted));

        return deleted;
    }

    public tryDeleteRange(entities: Iterable<DeepReadonly<TEntity>>): Iterable<TEntity>
    {
        const keys = Iteration.Map(entities, e => this._primaryKey.getEntityKey(e));
        return this.tryDeleteRangeByKeys(keys);
    }

    public tryDeleteRangeByKeys(keys: Iterable<DeepReadonly<TKey>>): Iterable<TEntity>
    {
        const deleted = Iteration.ToArray(
            Iteration.FilterNotNull(
                Iteration.Map(keys, k =>
                    {
                        const entity = this._primaryKey.tryGet(k);
                        return isNull(entity) ? null : makeMapEntry(k, entity);
                    })));

        const indexes = Iteration.ToArray(this._indexes.values());

        for (const d of deleted)
        {
            this._primaryKey.deleteByKey(d.key);
            for (const index of indexes)
                index.delete(toDeepReadonly(d.value));
        }
        return Iteration.Map(deleted, d => d.value);
    }

    public clear(): void
    {
        this._primaryKey.clear();
        for (const index of this._indexes.values())
            index.clear();
    }

    public entities(): Iterable<TEntity>
    {
        return this._primaryKey.values();
    }

    public getIndex<TIndexKey>(name: string): IReadonlyTableIndex<TIndexKey, TEntity>
    {
        const index = this.tryGetIndex<TIndexKey>(name);

        if (isNull(index))
            throw new Error(`index '${name}' doesn't exist in table '${this.name}'`);

        return index;
    }

    public tryGetIndex<TIndexKey>(name: string): Nullable<IReadonlyTableIndex<TIndexKey, TEntity>>
    {
        return this._indexes.tryGet(decorateIndexName(this.name, name));
    }

    public hasIndex(name: string): boolean
    {
        return this._indexes.has(decorateIndexName(this.name, name));
    }

    public addIndex<TIndexKey>(
        name: string,
        keySelector: KeySelector<TIndexKey, TEntity>,
        keyStringifier?: Stringifier<TIndexKey>): void
    {
        const decoratedName = decorateIndexName(this.name, Assert.IsNotEmpty(name, 'name'));

        if (this._indexes.has(decoratedName))
            throw new Error(`index '${name}' already exists in table '${this.name}'`);

        const index = new TableIndex<TIndexKey, TEntity>(decoratedName, keySelector, keyStringifier);
        for (const entity of this._primaryKey.values())
            index.add(entity);

        this._indexes.set(decoratedName, index);
    }

    public deleteIndex(name: string): void
    {
        const decoratedName = decorateIndexName(this.name, name);

        if (!this._indexes.tryDelete(decoratedName))
            throw new Error(`table '${this.name}' doesn't contain an index '${name}'`);
    }

    public clearIndexes(): void
    {
        this._indexes.clear();
    }

    public* indexNames(): Iterable<string>
    {
        for (const index of this._indexes.values())
            yield extractIndexName(this.name, index);
    }

    public [Symbol.iterator](): IterableIterator<MapEntry<TKey, TEntity>>
    {
        return this._primaryKey[Symbol.iterator]();
    }
}
