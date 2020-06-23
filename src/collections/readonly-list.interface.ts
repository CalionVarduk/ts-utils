import { IReadonlyListNode } from './readonly-list-node.interface';
import { Nullable } from '../types/nullable';
import { IReadonlyCollection } from './readonly-collection.interface';

/** Represents a readonly linked list data structure. */
export interface IReadonlyList<T>
    extends
    IReadonlyCollection<T>
{
    /** Specifies whether or not the list is empty. */
    readonly isEmpty: boolean;

    /** The first node in the list. */
    readonly first: Nullable<IReadonlyListNode<T>>;

    /** The last node in the list. */
    readonly last: Nullable<IReadonlyListNode<T>>;
}
