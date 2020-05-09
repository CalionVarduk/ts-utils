import { DeepReadonly } from '../types/deep-readonly';

/** Represents a collection of objects with the same key. */
export type Grouping<TKey, TValue> =
Iterable<TValue> &
{
    /** Group key. */
    readonly key: DeepReadonly<TKey>;

    /** Group items. */
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
        items: items,
        [Symbol.iterator]()
        {
            return items[Symbol.iterator]();
        }
    };
}
