/** Represents an event delegate type. */
export type EventDelegate<TEvent = any, TArgs = any> = (event?: IEvent<TEvent, TArgs>, sender?: any, args?: TArgs) => void;

/** Represents an event that can be listened to. */
export interface IEvent<TEvent = any, TArgs = any>
{
    /** Returns the amount of listeners attached to the event. */
    readonly listenerCount: number;

    /** Returns all listeners attached to the event. */
    readonly listeners: EventDelegate<TEvent, TArgs>[];

    /** Represents the event's type. */
    readonly type: Readonly<TEvent>;

    /**
     * Adds another `listener`.
     * @param listener Function that will be invoked when the event is published.
     * @returns `this`.
     */
    addListener(listener: EventDelegate<TEvent, TArgs>): this;

    /**
     * Checks whether or not the `listener` is attached to the event.
     * @param listener Function to check.
     * @returns `true`, if `listener` is attached to the event, otherwise `false`.
     */
    containsListener(listener: EventDelegate<TEvent, TArgs>): boolean;

    /**
     * Removes `listener` from the event.
     * @param listener Function to remove.
     * @returns `true`, if `listener` was attached to the event and was removed successfuly, otherwise `false`.
     */
    removeListener(listener: EventDelegate<TEvent, TArgs>): boolean;
}

/** Represents an event that can be published and listened to. */
export class EventHandler<TEvent = any, TArgs = any> implements IEvent<TEvent, TArgs>
{
    public get listenerCount(): number
    {
        return this._listeners.length;
    }
    public get listeners(): EventDelegate<TEvent, TArgs>[]
    {
        return [...this._listeners];
    }

    public readonly type: Readonly<TEvent>;
    private _listeners: EventDelegate<TEvent, TArgs>[];

    /**
     * Creates a new event object.
     * @param type Event type.
     */
    public constructor(type: Readonly<TEvent>)
    {
        this.type = type;
        this._listeners = [];
    }

    public addListener(listener: EventDelegate<TEvent, TArgs>): this
    {
        this._listeners.push(listener);
        return this;
    }

    public containsListener(listener: EventDelegate<TEvent, TArgs>): boolean
    {
        return this._listeners.some(l => l === listener);
    }

    public removeListener(listener: EventDelegate<TEvent, TArgs>): boolean
    {
        if (!this.containsListener(listener))
            return false;

        this._listeners = this._listeners.filter(l => l !== listener);
        return true;
    }

    /**
     * Removes all listeners.
     */
    public clear(): void
    {
        this._listeners.splice(0, this._listeners.length);
    }

    /**
     * Publishes the event with the provided arguments.
     * @param args Event arguments.
     * @returns `this`.
     */
    public publish(sender?: any, args?: TArgs): this
    {
        for (const listener of this._listeners)
            listener(this, sender, args);

        return this;
    }
}
