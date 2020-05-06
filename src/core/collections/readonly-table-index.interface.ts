import { MapEntry } from './map-entry';
import { DeepReadonly } from '../types/deep-readonly';
import { Nullable } from '../types/nullable';
import { Stringifier } from '../types/stringifier';
import { KeySelector } from './key-selector';

export interface IReadonlyTableIndex<TKey, TEntity>
    extends
    Iterable<MapEntry<TKey, TEntity>>
{
    readonly name: string;
    readonly length: number;

    readonly keyStringifier: Stringifier<TKey>;
    readonly keySelector: KeySelector<TKey, TEntity>;

    get(key: DeepReadonly<TKey>): TEntity;
    tryGet(key: DeepReadonly<TKey>): Nullable<TEntity>;
    getRange(keys: Iterable<DeepReadonly<TKey>>): Iterable<TEntity>;
    tryGetRange(keys: Iterable<DeepReadonly<TKey>>): Iterable<TEntity>;
    getEntityKey(entity: DeepReadonly<TEntity>): DeepReadonly<TKey>;
    has(entity: DeepReadonly<TEntity>): boolean;
    hasKey(key: DeepReadonly<TKey>): boolean;
    keys(): Iterable<DeepReadonly<TKey>>;
    values(): Iterable<TEntity>;
    entities(): Iterable<MapEntry<TKey, TEntity>>;
}
