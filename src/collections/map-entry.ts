import { DeepReadonly } from '../types/deep-readonly';

/** Represents a map entry. */
export type MapEntry<TKey, TValue> =
{
    /** Entry's key. */
    readonly key: DeepReadonly<TKey>;

    /** Entry's value. */
    readonly value: TValue;
};

/**
 * Creates a new MapEntry object.
 * @param key Entry's key.
 * @param value Entry's items.
 * @returns A MapEntry object.
 */
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
