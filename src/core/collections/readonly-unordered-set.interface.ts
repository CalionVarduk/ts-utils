import { DeepReadonly } from '../types/deep-readonly';
import { Stringifier } from './stringifier';

export interface IReadonlyUnorderedSet<T>
    extends
    Iterable<T>
{
    readonly length: number;
    readonly isEmpty: boolean;
    readonly stringifier: Stringifier<T>;

    has(obj: DeepReadonly<T>): boolean;
    entries(): Iterable<T>;
}
