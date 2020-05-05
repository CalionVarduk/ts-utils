import { TableIndex } from './table-index';
import { UnorderedMap } from './unordered-map';
import { MapEntry } from './map-entry';
import { IReadonlyTable } from './readonly-table.interface';
import { IReadonlyTableIndex } from './readonly-table-index.interface';
import { KeySelector } from './key-selector';
import { EnsuredStringifier } from '../stringifier';
import { Assert } from '../functions/assert';
import { DeepReadonly, toDeepReadonly } from '../types/deep-readonly';
import { Nullable } from '../types';
import { isNull } from '../functions/is-null';

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
        primaryKeyStringifier?: EnsuredStringifier<TKey>)
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
        const invalidIndexes: TableIndex<any, TEntity>[] = [];

        if (this._primaryKey.has(toDeepReadonly(entity)))
            invalidIndexes.push(this._primaryKey);

        for (const index of this._indexes.values())
            if (index.has(toDeepReadonly(entity)))
                invalidIndexes.push(index);

        if (invalidIndexes.length !== 0)
            throw new Error(
                `failed to add an entity ${JSON.stringify(entity)} to table '${this.name}' due to conflicting indexes:
                ${invalidIndexes.map(i => `[${i.name}] key: ${JSON.stringify(i.getEntityKey(toDeepReadonly(entity)))}`).join('\n')}`);

        this._primaryKey.add(entity);
        for (const index of this._indexes.values())
            index.add(entity);
    }

    public delete(entity: DeepReadonly<TEntity>): void
    {
        this._primaryKey.delete(entity);
        for (const index of this._indexes.values())
            index.delete(entity);
    }

    public deleteByKey(key: DeepReadonly<TKey>): void
    {
        this.delete(toDeepReadonly(this._primaryKey.get(key)));
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
        keyStringifier?: EnsuredStringifier<TIndexKey>): void
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
