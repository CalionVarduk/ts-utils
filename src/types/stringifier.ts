import { DeepReadonly } from './deep-readonly';

/** Stringifier type alias. */
export type Stringifier<T> = (obj: DeepReadonly<T>) => string;
