import { DeepReadonly } from '../types/deep-readonly';

export type MapEntry<TKey, TValue> =
{
    readonly key: DeepReadonly<TKey>;
    readonly value: TValue;
};

export function makeMapEntry<TKey, TValue>(
    key: DeepReadonly<TKey>,
    value: TValue):
    MapEntry<TKey, TValue>
{
    return {
        key: key,
        value: value
    };
}
