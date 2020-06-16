import { Nullable } from '../types/nullable';
import { IReadonlyCollection } from './readonly-collection.interface';

/** Represents a readonly queue data structure. */
export interface IReadonlyQueue<T>
    extends
    IReadonlyCollection<T>
{
    /** Specifies whether or not the queue is empty. */
    readonly isEmpty: boolean;

    /**
     * Returns an item that is currently first in the queue.
     * @throws An `Error`, when the queue is empty.
     * @returns First item in the queue.
     */
    first(): T;

    /**
     * Returns an item that is currently first in the queue.
     * @returns First item in the queue, or `null`, if the queue is empty.
     */
    tryFirst(): Nullable<T>;

    /**
     * Returns an item that is currently last in the queue.
     * @throws An `Error`, when the queue is empty.
     * @returns Last item in the queue.
     */
    last(): T;

    /**
     * Returns an item that is currently last in the queue.
     * @returns Last item in the queue, or `null`, if the queue is empty.
     */
    tryLast(): Nullable<T>;

    /**
     * Returns an item that is currently at the specified position in the queue.
     * @param index Item's position.
     * @throws An `Error`, when index is out of range.
     * @returns Item at the specified position in the queue.
     */
    peekAt(index: number): T;

    /**
     * Returns an item that is currently at the specified position in the queue.
     * @param index Item's position.
     * @returns Item at the specified position in the queue, or `null`, if index is out of range.
     */
    tryPeekAt(index: number): Nullable<T>;
}
