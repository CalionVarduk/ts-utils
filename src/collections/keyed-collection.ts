import { KeyedCollectionLookup } from './keyed-collection-lookup';
import { UnorderedMap } from './unordered-map';
import { MapEntry, makeMapEntry } from './map-entry';
import { IReadonlyKeyedCollection } from './readonly-keyed-collection.interface';
import { IKeyedCollectionLookup } from './keyed-collection-lookup.interface';
import { KeySelector } from './key-selector';
import { Stringifier } from '../types/stringifier';
import { Assert } from '../functions/assert';
import { DeepReadonly, toDeepReadonly } from '../types/deep-readonly';
import { Nullable } from '../types/nullable';
import { isNull } from '../functions/is-null';
import { Iteration } from './iteration';
import { deepReadonlyCast } from '../functions/readonly-cast';
import { createIterable } from '../functions/create-iterable';
import { isDefined } from '../functions/is-defined';

function decoratePrimaryLookupName(collectionName: string): string
{
    return `PLKP_${collectionName}`;
}

function extractCollectionName<TKey, TEntity>(primaryLookup: IKeyedCollectionLookup<TKey, TEntity>): string
{
    return primaryLookup.name.substr(5);
}

function decorateLookupName(collectionName: string, lookupName: string): string
{
    return `LKP_${collectionName}_${lookupName}`;
}

function extractLookupName<TKey, TEntity>(collectionName: string, lookup: IKeyedCollectionLookup<TKey, TEntity>): string
{
    return lookup.name.substr(collectionName.length + 5);
}

function buildEntityAdditionErrorMsg<TEntity>(
    collectionName: string,
    entity: TEntity,
    invalidLookups: ReadonlyArray<KeyedCollectionLookup<any, TEntity>>):
    string
{
    return `failed to add an entity ${JSON.stringify(entity)} to collection '${collectionName}' due to conflicting lookups:
${invalidLookups.map(i => `[${i.name}] key: ${JSON.stringify(i.getEntityKey(toDeepReadonly(entity)))}`).join('\n')}`;
}

/** Represents a keyed collection of entities. */
export class KeyedCollection<TKey, TEntity>
    implements
    IReadonlyKeyedCollection<TKey, TEntity>
{
    /**
     * Creates a new keyed collection with the same definition and lookups as in the provided collection.
     * @param collection Collection to clone schema from.
     * @param name An optional cloned collection's name.
     * @returns A new keyed collection.
     */
    public static CloneSchema<K, E>(
        collection: IReadonlyKeyedCollection<K, E>,
        name?: string):
        KeyedCollection<K, E>
    {
        const result = new KeyedCollection<K, E>(
            isDefined(name) ? name : collection.name,
            collection.primaryLookup.keySelector,
            collection.primaryLookup.keyStringifier);

        for (const lookupName of collection.lookupNames())
        {
            const lookup = collection.getLookup(lookupName);
            result.addLookup(lookupName, lookup.keySelector, lookup.keyStringifier);
        }
        return result;
    }

    public get name(): string
    {
        return extractCollectionName(this._primaryLookup);
    }

    public get length(): number
    {
        return this._primaryLookup.length;
    }

    public get isEmpty(): boolean
    {
        return this._primaryLookup.length === 0;
    }

    public get primaryLookup(): IKeyedCollectionLookup<TKey, TEntity>
    {
        return this._primaryLookup;
    }

    public get lookupCount(): number
    {
        return this._lookups.length;
    }

    private readonly _primaryLookup: KeyedCollectionLookup<TKey, TEntity>;
    private readonly _lookups: UnorderedMap<string, KeyedCollectionLookup<any, TEntity>>;

    /**
     * Creates a new, empty KeyedCollection object.
     * @param name Collection's name.
     * @param primaryKeySelector Primary lookup's key selector used for identifying entities.
     * @param primaryKeyStringifier An optional, primary lookup's key stringifier used for key comparison.
     */
    public constructor(
        name: string,
        primaryKeySelector: KeySelector<TKey, TEntity>,
        primaryKeyStringifier?: Stringifier<TKey>)
    {
        this._primaryLookup = new KeyedCollectionLookup<TKey, TEntity>(
            decoratePrimaryLookupName(Assert.IsNotEmpty(name, 'name')),
            primaryKeySelector,
            primaryKeyStringifier);

        this._lookups = new UnorderedMap<string, KeyedCollectionLookup<any, TEntity>>();
    }

    public get(key: DeepReadonly<TKey>): TEntity
    {
        return this._primaryLookup.get(key);
    }

    public tryGet(key: DeepReadonly<TKey>): Nullable<TEntity>
    {
        return this._primaryLookup.tryGet(key);
    }

    public getRange(keys: Iterable<DeepReadonly<TKey>>): Iterable<TEntity>
    {
        return this._primaryLookup.getRange(keys);
    }

    public tryGetRange(keys: Iterable<DeepReadonly<TKey>>): Iterable<TEntity>
    {
        return this._primaryLookup.tryGetRange(keys);
    }

    public has(entity: DeepReadonly<TEntity>): boolean
    {
        return this._primaryLookup.has(entity);
    }

    public hasKey(key: DeepReadonly<TKey>): boolean
    {
        return this._primaryLookup.hasKey(key);
    }

    /**
     * Adds a new entity to the collection.
     * @param entity Entity to add.
     * @throws An `Error`, if the entity already exists in either the primary lookup, or any of the additional lookups.
     */
    public add(entity: TEntity): void
    {
        if (this.lookupCount > 0)
        {
            const invalidLookups: KeyedCollectionLookup<any, TEntity>[] = [];

            if (this._primaryLookup.has(toDeepReadonly(entity)))
                invalidLookups.push(this._primaryLookup);

            for (const lookup of this._lookups.values())
                if (lookup.has(toDeepReadonly(entity)))
                    invalidLookups.push(lookup);

            if (invalidLookups.length !== 0)
                throw new Error(buildEntityAdditionErrorMsg(this.name, entity, invalidLookups));

            this._primaryLookup.add(entity);
            for (const lookup of this._lookups.values())
                lookup.add(entity);
        }
        else if (!this._primaryLookup.tryAdd(entity))
            throw new Error(buildEntityAdditionErrorMsg(this.name, entity, [this._primaryLookup]));
    }

    /**
     * Transactionally adds a range of entities to the collection.
     * @param entities Entities to add.
     * @throws An `Error`, if any of entities already exists in either the primary lookup, or any of the additional lookups.
     */
    public addRange(entities: Iterable<TEntity>): void
    {
        if (this.lookupCount > 0)
        {
            const lookups = Iteration.Materialize(
                Iteration.Concat(
                    Iteration.ToIterable<KeyedCollectionLookup<any, TEntity>>(this._primaryLookup),
                    this._lookups.values()));

            for (const lookup of lookups)
                if (Iteration.HasDuplicates(
                    Iteration.Map(entities, e => lookup.getEntityKey(toDeepReadonly(e))),
                    lookup.keyStringifier))
                    throw new Error(`can't add entities with duplicated lookup '${lookup.name}' keys to table '${this.name}'`);

            for (const entity of entities)
            {
                const invalidLookups: KeyedCollectionLookup<any, TEntity>[] = [];

                for (const lookup of lookups)
                    if (lookup.has(toDeepReadonly(entity)))
                        invalidLookups.push(lookup);

                if (invalidLookups.length !== 0)
                    throw new Error(buildEntityAdditionErrorMsg(this.name, entity, invalidLookups));
            }

            for (const entity of entities)
                for (const lookup of lookups)
                    lookup.add(entity);
        }
        else
        {
            if (Iteration.HasDuplicates(
                Iteration.Map(entities, e => deepReadonlyCast(this._primaryLookup.getEntityKey(toDeepReadonly(e)))),
                this._primaryLookup.keyStringifier))
                throw new Error(`can't add entities with duplicated lookup '${this._primaryLookup.name}' keys to table '${this.name}'`);

            for (const entity of entities)
                if (this._primaryLookup.has(toDeepReadonly(entity)))
                    throw new Error(buildEntityAdditionErrorMsg(this.name, entity, [this._primaryLookup]));

            for (const entity of entities)
                this._primaryLookup.add(entity);
        }
    }

    /**
     * Adds a new entity to the collection.
     * @param entity Entity to add.
     * @returns `true`, if the entity has been added successfuly, otherwise `false`.
     */
    public tryAdd(entity: TEntity): boolean
    {
        if (this.lookupCount > 0)
        {
            if (this._primaryLookup.has(toDeepReadonly(entity)) ||
                Iteration.Some(this._lookups.values(), i => i.has(toDeepReadonly(entity))))
                return false;

            this._primaryLookup.add(entity);
            for (const lookup of this._lookups.values())
                lookup.add(entity);
        }
        else if (!this._primaryLookup.tryAdd(entity))
            return false;

        return true;
    }

    /**
     * Transactionally adds a range of entities to the collection.
     * @param entities Entities to add.
     * @returns An iterable containing entities, that have been added successfuly.
     */
    public tryAddRange(entities: Iterable<TEntity>): Iterable<TEntity>
    {
        const added: TEntity[] = [];

        if (this.lookupCount > 0)
        {
            const lookups = Iteration.Materialize(this._lookups.values());

            for (const entity of entities)
            {
                if (this._primaryLookup.has(toDeepReadonly(entity)) ||
                    Iteration.Some(lookups, i => i.has(toDeepReadonly(entity))))
                    continue;

                this._primaryLookup.add(entity);
                for (const lookup of lookups)
                    lookup.add(entity);

                added.push(entity);
            }
        }
        else
        {
            for (const entity of entities)
                if (this._primaryLookup.tryAdd(entity))
                    added.push(entity);
        }
        return added;
    }

    /**
     * Removes an entity from the collection.
     * @param entity Entity to remove.
     * @throws An `Error`, if the entity doesn't exist.
     * @returns Removed entity.
     */
    public delete(entity: DeepReadonly<TEntity>): TEntity
    {
        const key = this._primaryLookup.getEntityKey(entity);
        return this.deleteByKey(key);
    }

    /**
     * Removes an entity associated with the provided `key` from the collection.
     * @param key Key of an entity to remove.
     * @throws An `Error`, if the entity doesn't exist.
     * @returns Removed entity.
     */
    public deleteByKey(key: DeepReadonly<TKey>): TEntity
    {
        const deleted = this._primaryLookup.get(key);

        this._primaryLookup.deleteByKey(key);
        for (const lookup of this._lookups.values())
            lookup.delete(toDeepReadonly(deleted));

        return deleted;
    }

    /**
     * Transactionally removes entities from the collection.
     * @param entities Entities to remove.
     * @throws An `Error`, if any of the provided entities doesn't exist.
     * @returns Removed entities.
     */
    public deleteRange(entities: Iterable<DeepReadonly<TEntity>>): Iterable<TEntity>
    {
        const keys = Iteration.Map(entities, e => this._primaryLookup.getEntityKey(e));
        return this.deleteRangeByKeys(keys);
    }

    /**
     * Transactionally removes entities with provided keys from the collection.
     * @param entities Entities to remove.
     * @throws An `Error`, if any of the provided entities doesn't exist.
     * @returns Removed entities.
     */
    public deleteRangeByKeys(keys: Iterable<DeepReadonly<TKey>>): Iterable<TEntity>
    {
        const deleted = Iteration.Materialize(
            Iteration.Map(
                Iteration.Unique(
                    Iteration.ReinterpretCast<TKey>(keys),
                    this._primaryLookup.keyStringifier),
                k => makeMapEntry(toDeepReadonly(k), this._primaryLookup.get(toDeepReadonly(k)))));

        const lookups = Iteration.Materialize(this._lookups.values());

        for (const d of deleted)
        {
            this._primaryLookup.deleteByKey(d.key);
            for (const lookup of lookups)
                lookup.delete(toDeepReadonly(d.value));
        }
        return Iteration.Map(deleted, d => d.value);
    }

    /**
     * Removes an entity from the collection.
     * @param entity Entity to remove.
     * @returns Removed entity, or `null`, if the entity didn't exist.
     */
    public tryDelete(entity: DeepReadonly<TEntity>): Nullable<TEntity>
    {
        const key = this._primaryLookup.getEntityKey(entity);
        return this.tryDeleteByKey(key);
    }

    /**
     * Removes an entity associated with the provided `key` from the collection.
     * @param key Key of an entity to remove.
     * @returns Removed entity, or `null`, if the entity didn't exist.
     */
    public tryDeleteByKey(key: DeepReadonly<TKey>): Nullable<TEntity>
    {
        const deleted = this._primaryLookup.tryGet(key);

        if (isNull(deleted))
            return null;

        this._primaryLookup.deleteByKey(key);
        for (const lookup of this._lookups.values())
            lookup.delete(toDeepReadonly(deleted));

        return deleted;
    }

    /**
     * Transactionally removes entities from the collection.
     * @param entities Entities to remove.
     * @returns Removed entities, ignoring the non-existing ones.
     */
    public tryDeleteRange(entities: Iterable<DeepReadonly<TEntity>>): Iterable<TEntity>
    {
        const keys = Iteration.Map(entities, e => this._primaryLookup.getEntityKey(e));
        return this.tryDeleteRangeByKeys(keys);
    }

    /**
     * Transactionally removes entities with provided keys from the collection.
     * @param entities Entities to remove.
     * @returns Removed entities, ignoring the non-existing ones.
     */
    public tryDeleteRangeByKeys(keys: Iterable<DeepReadonly<TKey>>): Iterable<TEntity>
    {
        const deleted = Iteration.Materialize(
            Iteration.FilterNotNull(
                Iteration.Map(
                    Iteration.Unique(
                        Iteration.ReinterpretCast<TKey>(keys),
                        this._primaryLookup.keyStringifier),
                    k =>
                    {
                        const entity = this._primaryLookup.tryGet(toDeepReadonly(k));
                        return isNull(entity) ? null : makeMapEntry(toDeepReadonly(k), entity);
                    })));

        const lookups = Iteration.Materialize(this._lookups.values());

        for (const d of deleted)
        {
            this._primaryLookup.deleteByKey(d.key);
            for (const lookup of lookups)
                lookup.delete(toDeepReadonly(d.value));
        }
        return Iteration.Map(deleted, d => d.value);
    }

    /**
     * Removes all entities from the collection.
     */
    public clear(): void
    {
        this._primaryLookup.clear();
        for (const lookup of this._lookups.values())
            lookup.clear();
    }

    public entities(): Iterable<TEntity>
    {
        return this._primaryLookup.values();
    }

    /**
     * Returns an additional lookup associated with the provided name.
     * @param name Name to get a lookup for.
     * @throws An `Error`, when lookup doesn't exist.
     * @returns A lookup associated with the provided name.
     */
    public getLookup<TLookupKey>(name: string): IKeyedCollectionLookup<TLookupKey, TEntity>
    {
        const lookup = this.tryGetLookup<TLookupKey>(name);

        if (isNull(lookup))
            throw new Error(`lookup '${name}' doesn't exist in table '${this.name}'`);

        return lookup;
    }

    /**
     * Returns an additional lookup associated with the provided name.
     * @param name Name to get a lookup for.
     * @returns A lookup associated with the provided name, or `null`, if lookup doesn't exist.
     */
    public tryGetLookup<TLookupKey>(name: string): Nullable<IKeyedCollectionLookup<TLookupKey, TEntity>>
    {
        return this._lookups.tryGet(decorateLookupName(this.name, name));
    }

    /**
     * Checks whether or not an additional lookup exists in the collection.
     * @param name Lookup name to check.
     * @returns `true`, if lookup exists, otherwise `false`.
     */
    public hasLookup(name: string): boolean
    {
        return this._lookups.has(decorateLookupName(this.name, name));
    }

    /**
     * Adds a new additional lookup to the collection.
     * @param name Lookup's name.
     * @param keySelector Lookup's key selector used for identifying entities.
     * @param keyStringifier An optional, lookup's key stringifier used for key comparison.
     * @throws An `Error`, if the lookup with the provided name already exists.
     */
    public addLookup<TLookupKey>(
        name: string,
        keySelector: KeySelector<TLookupKey, TEntity>,
        keyStringifier?: Stringifier<TLookupKey>): void
    {
        const decoratedName = decorateLookupName(this.name, Assert.IsNotEmpty(name, 'name'));

        if (this._lookups.has(decoratedName))
            throw new Error(`lookup '${name}' already exists in table '${this.name}'`);

        const lookup = new KeyedCollectionLookup<TLookupKey, TEntity>(decoratedName, keySelector, keyStringifier);
        for (const entity of this._primaryLookup.values())
            lookup.add(entity);

        this._lookups.set(decoratedName, lookup);
    }

    /**
     * Removes an additional lookup from the collection.
     * @param name Name of the lookup to remove.
     * @throws An `Error`, if the lookup doesn't exist.
     */
    public deleteLookup(name: string): void
    {
        const decoratedName = decorateLookupName(this.name, name);
        const lookup = this._lookups.tryGet(decoratedName);

        if (isNull(lookup))
            throw new Error(`table '${this.name}' doesn't contain a lookup '${name}'`);

        lookup.clear();
        this._lookups.delete(decoratedName);
    }

    /**
     * Removes all additional lookups from the collection.
     */
    public clearLookups(): void
    {
        for (const lookup of this._lookups.values())
            lookup.clear();

        this._lookups.clear();
    }

    public lookupNames(): Iterable<string>
    {
        const name = this.name;
        const lookups = this._lookups;
        return createIterable(function*()
            {
                for (const lookup of lookups.values())
                    yield extractLookupName(name, lookup);
            });
    }

    public [Symbol.iterator](): IterableIterator<MapEntry<TKey, TEntity>>
    {
        return this._primaryLookup[Symbol.iterator]();
    }
}
