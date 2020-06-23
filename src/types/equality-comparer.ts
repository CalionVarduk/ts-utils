import { DeepReadonly } from './deep-readonly';

/** Equality comparer type alias. */
export type EqualityComparer<T> = (left: DeepReadonly<T>, right: DeepReadonly<T>) => boolean;
