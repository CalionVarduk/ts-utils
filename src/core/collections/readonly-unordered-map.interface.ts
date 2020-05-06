import { MapEntry } from './map-entry';
import { DeepReadonly } from '../types/deep-readonly';
import { Stringifier } from '../types/stringifier';
import { Nullable } from '../types/nullable';

export interface IReadonlyUnorderedMap<TKey, TValue>
    extends
    Iterable<MapEntry<TKey, TValue>>
{
    readonly length: number;
    readonly isEmpty: boolean;
    readonly stringifier: Stringifier<TKey>;

    get(key: DeepReadonly<TKey>): TValue;
    tryGet(key: DeepReadonly<TKey>): Nullable<TValue>;
    has(key: DeepReadonly<TKey>): boolean;
    keys(): Iterable<DeepReadonly<TKey>>;
    values(): Iterable<TValue>;
    entries(): Iterable<MapEntry<TKey, TValue>>;
}
