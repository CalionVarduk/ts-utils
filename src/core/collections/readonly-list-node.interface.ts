import { Nullable } from '../types/nullable';

export interface IReadonlyListNode<T>
{
    readonly value: T;
    readonly prev: Nullable<IReadonlyListNode<T>>;
    readonly next: Nullable<IReadonlyListNode<T>>;
    readonly isFirst: boolean;
    readonly isLast: boolean;
}
