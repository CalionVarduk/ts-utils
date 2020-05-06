import { DeepReadonly } from '../types/deep-readonly';

/** Represents a collection of objects with the same key. */
export type Grouping<TKey, TValue> =
{
    readonly key: DeepReadonly<TKey>;
    readonly items: ReadonlyArray<TValue>;
};

/**
 * Creates a new Grouping object.
 * @param key Group's key.
 * @param items Group's items.
 * @returns A Grouping object.
 */
export function makeGrouping<TKey, TValue>(
    key: DeepReadonly<TKey>,
    items: ReadonlyArray<TValue>):
    Grouping<TKey, TValue>
{
    return {
        key: key,
        items: items
    };
}
