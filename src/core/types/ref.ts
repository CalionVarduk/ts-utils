/** Ref type alias. */
export type Ref<T> =
{
    value: T;
};

/**
 * Creates a new Ref-like object with the provided `value`.
 * @param value object to be held by the returned Ref-like object
 * @returns a Ref-like object that holds the provided `value`
 */
export function makeRef<T>(value: T): Ref<T>
{
    return { value: value };
}
