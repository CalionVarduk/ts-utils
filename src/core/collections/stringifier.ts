import { Ensured } from '../types/ensured';
import { DeepReadonly } from '../types/deep-readonly';

export type Stringifier<T> = (obj: Ensured<DeepReadonly<T>>) => string;
