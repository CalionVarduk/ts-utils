/** Represents a pair of objects. */
export type Pair<T, U> =
{
    /** First pair object. */
    first: T;

    /** Second pair object. */
    second: U;
};

/**
 * Creates a new Pair object.
 * @param first First pair object.
 * @param second Second pair object.
 * @returns A Pair object.
 */
export function makePair<T, U>(first: T, second: U): Pair<T, U>
{
    return {
        first: first,
        second: second
    };
}
