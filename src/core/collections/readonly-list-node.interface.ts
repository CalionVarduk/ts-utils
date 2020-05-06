import { Nullable } from '../types/nullable';

/** Represents a list's node. */
export interface IReadonlyListNode<T>
{
    /** Node's value. */
    readonly value: T;

    /** Reference to the previous node in this node's list. */
    readonly prev: Nullable<IReadonlyListNode<T>>;

    /** Reference to the next node in this node's list. */
    readonly next: Nullable<IReadonlyListNode<T>>;

    /** Specifies whether or not this node is the first node of its list. */
    readonly isFirst: boolean;

    /** Specifies whether or not this node is the last node of its list. */
    readonly isLast: boolean;
}
