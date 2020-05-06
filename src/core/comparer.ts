import { DeepReadonly } from './types/deep-readonly';

export type Comparer<T> = (left: DeepReadonly<T>, right: DeepReadonly<T>) => number;
