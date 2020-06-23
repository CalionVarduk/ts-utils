/** Represents a collection of objects. */
export interface IReadonlyCollection<T>
    extends
    Iterable<T>
{
    /** Specifies the collection's length. */
    readonly length: number;
}
