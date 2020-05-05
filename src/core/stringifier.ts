import { DeepReadonly } from './types/deep-readonly';
import { Ensured } from './types';

export type Stringifier<T> = (obj: DeepReadonly<T>) => string;
export type EnsuredStringifier<T> = (obj: Ensured<DeepReadonly<T>>) => string;
