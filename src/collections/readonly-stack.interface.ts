import { Nullable } from '../types';
import { IReadonlyCollection } from './readonly-collection.interface';

/** Represents a readonly stack data structure. */
export interface IReadonlyStack<T>
    extends
    IReadonlyCollection<T>
{
    /** Specifies whether or not the stack is empty. */
    readonly isEmpty: boolean;

    /**
     * Returns an item that is currently on top of the stack.
     * @throws An `Error`, when the stack is empty.
     * @returns Item on top of the stack.
     */
    peek(): T;

    /**
     * Returns an item that is currently on top of the stack, or `null`, if the stack is empty.
     * @returns Item on top of the stack, or `null`, if the stack is empty.
     */
    tryPeek(): Nullable<T>;

    /**
     * Returns an item that is currently at the specified position in the stack.
     * @param index Item's position.
     * @throws An `Error`, when index is out of range.
     * @returns Item at the specified position in the stack.
     */
    peekAt(index: number): T;

    /**
     * Returns an item that is currently at the specified position in the stack, or `null`, if index is out of range.
     * @param index Item's position.
     * @returns Item at the specified position in the stack, or `null`, if index is out of range.
     */
    tryPeekAt(index: number): Nullable<T>;
}
