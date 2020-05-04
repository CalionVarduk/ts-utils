import { UnorderedMapEntry } from './unordered-map-entry';
import { DeepReadonly } from '../types/deep-readonly';
import { Undefinable } from '../types/undefinable';
import { Stringifier } from './stringifier';

export interface IReadonlyUnorderedMap<TKey, TValue>
    extends
    Iterable<UnorderedMapEntry<TKey, TValue>>
{
    readonly length: number;
    readonly isEmpty: boolean;
    readonly stringifier: Stringifier<TKey>;

    get(key: DeepReadonly<TKey>): TValue;
    tryGet(key: DeepReadonly<TKey>): Undefinable<TValue>;
    has(key: DeepReadonly<TKey>): boolean;
    keys(): Iterable<DeepReadonly<TKey>>;
    values(): Iterable<TValue>;
    entries(): Iterable<UnorderedMapEntry<TKey, TValue>>;
}
