import { DeepReadonly } from '../types/deep-readonly';

export interface IGrouping<TKey, TValue>
{
    readonly key: DeepReadonly<TKey>;
    readonly items: ReadonlyArray<TValue>;
}
