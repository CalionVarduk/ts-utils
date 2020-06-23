import { DeepReadonly } from './deep-readonly';

/** Comparer type alias. */
export type Comparer<T> = (left: DeepReadonly<T>, right: DeepReadonly<T>) => number;
