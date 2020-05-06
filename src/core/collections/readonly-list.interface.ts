import { IReadonlyListNode } from './readonly-list-node.interface';
import { Nullable } from '../types/nullable';

/** Represents a readonly linked list data structure. */
export interface IReadonlyList<T>
    extends
    Iterable<T>
{
    /** Specifies the list's length. */
    readonly length: number;

    /** Specifies whether or not the list is empty. */
    readonly isEmpty: boolean;

    /** The first node in the list. */
    readonly first: Nullable<IReadonlyListNode<T>>;

    /** The last node in the list. */
    readonly last: Nullable<IReadonlyListNode<T>>;
}
