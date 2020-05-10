import { Comparer } from '../types/comparer';
import { Nullable } from '../types/nullable';

/** Represents a readonly heap data structure. */
export interface IReadonlyHeap<T>
    extends
    Iterable<T>
{
    /** Specifies the heap's length. */
    readonly length: number;

    /** Specifies whether or not the heap is empty. */
    readonly isEmpty: boolean;

    /** Specifies the item comparer used during heap operations. */
    readonly comparer: Comparer<T>;

    /**
     * Returns an item that is currently at the root of the heap.
     * @throws An `Error`, when the heap is empty.
     * @returns Item at the root of the heap.
     */
    peek(): T;

    /**
     * Returns an item that is currently at the root of the heap, or `null` if the heap is empty.
     * @returns Item at the root of the heap, or `null` if the heap is empty.
     */
    tryPeek(): Nullable<T>;

    /**
     * Creates a new, sorted array containing all elements from the heap.
     * @returns New, sorted array.
     */
    sort(): T[];
}
