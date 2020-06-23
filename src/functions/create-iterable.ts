/**
 * Creates a reusable iterable object from the provided iterator factory.
 * @param iteratorFactory Iterator factory used during creation of an iterable.
 * @returns New iterable object.
 */
export function createIterable<T>(iteratorFactory: () => Iterator<T>): Iterable<T>
{
    return {
        [Symbol.iterator]: iteratorFactory
    };
}
