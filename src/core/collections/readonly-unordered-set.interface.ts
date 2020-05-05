import { DeepReadonly } from '../types/deep-readonly';
import { EnsuredStringifier } from '../stringifier';

export interface IReadonlyUnorderedSet<T>
    extends
    Iterable<T>
{
    readonly length: number;
    readonly isEmpty: boolean;
    readonly stringifier: EnsuredStringifier<T>;

    has(obj: DeepReadonly<T>): boolean;
    entries(): Iterable<T>;
}
