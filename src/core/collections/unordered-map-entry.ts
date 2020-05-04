import { DeepReadonly } from '../types/deep-readonly';

export type UnorderedMapEntry<TKey, TValue> =
{
    readonly key: DeepReadonly<TKey>;
    readonly value: TValue;
};

export function makeUnorderedMapEntry<TKey, TValue>(
    key: DeepReadonly<TKey>,
    value: TValue):
    UnorderedMapEntry<TKey, TValue>
{
    return {
        key: key,
        value: value
    };
}
