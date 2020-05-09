import { DeepReadonly } from '../types/deep-readonly';
import { Stringifier } from '../types/stringifier';

/** Represents a readonly set data structure. */
export interface IReadonlyUnorderedSet<T>
    extends
    Iterable<T>
{
    /** Specifies the set's length. */
    readonly length: number;

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
