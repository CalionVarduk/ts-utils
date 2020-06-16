import { IDisposable } from '../disposable.interface';
import { Undefinable } from '../types/undefinable';
import { Nullable } from '../types/nullable';

/** Represents an event listener operator type. */
export type EventListenerOperator<TArgs = any> =
    (next: EventDelegate<TArgs>, listener: IEventListener<TArgs>) => Nullable<EventDelegate<TArgs>>;

/** Represents an event delegate type. */
export type EventDelegate<TArgs = any> =
    (sender: any, args: Undefinable<TArgs>, event: IEvent<TArgs>) => void;

/** Represents an event listener. */
export interface IEventListener<TArgs = any>
    extends
    IDisposable
{
    /** Specifies whether or not the event listener has been disposed. */
    readonly isDisposed: boolean;

    /** Specifies a base delegate associated with the event listener. */
    readonly delegate: EventDelegate<TArgs>;

    /**
     * Decorates the event listener with provided operators.
     * @param operators A collection of event listener operators.
     * @returns `this`.
     * */
    decorate(...operators: EventListenerOperator<TArgs>[]): this;
}

/** Represents an event that can be listened to. */
export interface IEvent<TArgs = any>
{
    /** Specifies all listeners attached to the event. */
    readonly listeners: ReadonlyArray<IEventListener<TArgs>>;

    /** Specifies whether or not the event has been disposed. */
    readonly isDisposed: boolean;

    /**
     * Adds a new listener to the event.
     * @param delegate A delegate, that will be invoked when the event is published.
     * @returns A new event listener.
     */
    listen(delegate: EventDelegate<TArgs>): IEventListener<TArgs>;
}
