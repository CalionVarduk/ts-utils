import { DeepReadonly } from './types/deep-readonly';

export type EqualityComparer<T> = (left: DeepReadonly<T>, right: DeepReadonly<T>) => boolean;
