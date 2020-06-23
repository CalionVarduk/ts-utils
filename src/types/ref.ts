/** Ref type alias. */
export type Ref<T> =
{
    /** Referenced value. */
    value: T;
};

/**
 * Creates a new Ref-like object with the provided `value`.
 * @param value Object to be held by the returned Ref-like object.
 * @returns A Ref-like object that holds the provided `value`.
 */
export function makeRef<T>(value: T): Ref<T>
{
    return { value: value };
}
