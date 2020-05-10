import { DeepReadonly } from '../types/deep-readonly';
import { Stringifier } from '../types/stringifier';
import { IReadonlyCollection } from './readonly-collection.interface';

/** Represents a readonly set data structure. */
export interface IReadonlyUnorderedSet<T>
    extends
    IReadonlyCollection<T>
{
    /** Specifies whether or not the set is empty. */
    readonly isEmpty: boolean;

    /** Specifies set's element stringifier used for object comparison. */
    readonly stringifier: Stringifier<T>;

    /**
     * Checks whether or not an object exists in the set.
     * @param obj Object to check.
     * @returns `true`, if object exists, otherwise `false`.
     */
    has(obj: DeepReadonly<T>): boolean;
}
