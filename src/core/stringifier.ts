import { DeepReadonly } from './types/deep-readonly';

export type Stringifier<T> = (obj: DeepReadonly<T>) => string;
