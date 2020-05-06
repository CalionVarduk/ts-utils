import { IReadonlyTableIndex } from './readonly-table-index.interface';
import { MapEntry } from './map-entry';
import { DeepReadonly } from '../types/deep-readonly';
import { Nullable } from '../types';

export interface IReadonlyTable<TKey, TEntity>
    extends
    Iterable<MapEntry<TKey, TEntity>>
{
    readonly name: string;
    readonly length: number;
    readonly primaryKey: IReadonlyTableIndex<TKey, TEntity>;
    readonly indexCount: number;

    get(key: DeepReadonly<TKey>): TEntity;
    tryGet(key: DeepReadonly<TKey>): Nullable<TEntity>;
    getRange(keys: Iterable<DeepReadonly<TKey>>): Iterable<TEntity>;
    tryGetRange(keys: Iterable<DeepReadonly<TKey>>): Iterable<TEntity>;
    has(entity: DeepReadonly<TEntity>): boolean;
    hasKey(key: DeepReadonly<TKey>): boolean;
    entities(): Iterable<TEntity>;
    getIndex<TIndexKey>(name: string): IReadonlyTableIndex<TIndexKey, TEntity>;
    tryGetIndex<TIndexKey>(name: string): Nullable<IReadonlyTableIndex<TIndexKey, TEntity>>;
    hasIndex(name: string): boolean;
    indexNames(): Iterable<string>;
}
