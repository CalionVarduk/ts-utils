import { IReadonlyListNode } from './readonly-list-node.interface';
import { Nullable } from '../types/nullable';

export interface IReadonlyList<T>
    extends
    Iterable<T>
{
    readonly length: number;
    readonly isEmpty: boolean;

    readonly first: Nullable<IReadonlyListNode<T>>;
    readonly last: Nullable<IReadonlyListNode<T>>;
}
