import { Nullable } from './types/nullable';
import { isNull } from './functions/is-null';
import { Undefinable } from './types/undefinable';

/** Represents a skippable action factory delegate. */
export type SkippableActionFactory<TArgs = any> =
    (args: Undefinable<TArgs>, action: SkippableAction<TArgs>) => Promise<void>;

/** Represents a skippable action execution environment. */
export class SkippableAction<TArgs = any>
{
    /** Returns whether or not the action is in the middle of being invoked. */
    public get isInvoking(): boolean
    {
        return !isNull(this._currentAction);
    }

    /**
     * Returns whether or not a next action invocation has been queued up,
     * which will be invoked right after the current invocation finishes.
     * */
    public get isNextInvocationQueued(): boolean
    {
        return !isNull(this._nextActionFactory);
    }

    /** Action factory function. */
    public readonly actionFactory: SkippableActionFactory<TArgs>;

    private _currentAction: Nullable<Promise<void>>;
    private _nextActionFactory: Nullable<() => Promise<void>>;

    /**
     * Creates a new SkippableAction object.
     * @param actionFactory Action factory function.
     */
    public constructor(actionFactory: SkippableActionFactory<TArgs>)
    {
        this.actionFactory = actionFactory;
        this._currentAction = null;
        this._nextActionFactory = null;
    }

    /**
     * Starts the action's invocation. If an invocation is already taking place,
     * then the most recent invocation will be cached in order to be invoked later.
     * @param args Optional action's arguments.
     * @returns A promise, that is currently in the process of being resolved.
     */
    public invoke(args?: TArgs): Promise<void>
    {
        if (this.isInvoking)
            this._nextActionFactory = () => this._createCurrentAction(args);
        else
            this._currentAction = this._createCurrentAction(args);

        return this._currentAction!;
    }

    /**
     * Returns the currently running action invocation.
     * @returns A promise, that is currently in the process of being resolved, or `null`, if the action is not being invoked.
     */
    public current(): Nullable<Promise<void>>
    {
        return this._currentAction;
    }

    private _createCurrentAction(args: Undefinable<TArgs>): Promise<void>
    {
        return this.actionFactory(args, this)
            .then(() =>
            {
                if (isNull(this._nextActionFactory))
                {
                    this._currentAction = null;
                    return;
                }
                this._currentAction = this._nextActionFactory();
                this._nextActionFactory = null;
            });
    }
}
