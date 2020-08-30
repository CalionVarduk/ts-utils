import { UnorderedMap } from '../collections';
import { EventHandler } from './event-handler';
import { IDisposable } from '../disposable.interface';
import { isNull, Assert } from '../functions';
import { IEventListener, EventDelegate, IEvent } from './event.interface';
import { Nullable } from '../types';

/** Represents an in-memory, event-driven message broker. */
export class MessageBroker
    implements
    IDisposable
{
    /** Specifies whether or not the message broker has been disposed. */
    public get isDisposed(): boolean
    {
        return this._isDisposed;
    }

    private readonly _handlers: UnorderedMap<string, EventHandler>;
    private _isDisposed: boolean;

    /** Create a new MessageBroker object. */
    public constructor()
    {
        this._handlers = new UnorderedMap<string, EventHandler>();
        this._isDisposed = false;
    }

    public dispose(): void
    {
        for (const handler of this._handlers.values())
            handler.dispose();

        this._handlers.clear();
        this._isDisposed = true;
    }

    /**
     * Creates a new message handler.
     * @param messageName New message handler's name.
     * @throws An `Error`, if a message handler with the provided name already exists or the message broker has been disposed.
     * @returns `this`
     */
    public createHandler(messageName: string): this
    {
        Assert.False(this._isDisposed, 'message broker has been disposed');

        if (this._handlers.has(messageName))
            throw new Error(`'${messageName}' message handler already exists.`);

        const handler = new EventHandler();
        this._handlers.add(messageName, handler);
        return this;
    }

    /**
     * Deletes and disposes a message handler. Does nothing, if the handler doesn't exist.
     * @param messageName Name of the message handler to delete.
     * @returns `this`
     */
    public deleteHandler(messageName: string): this
    {
        const handler = this._handlers.tryGet(messageName);
        if (!isNull(handler))
        {
            handler.dispose();
            this._handlers.delete(messageName);
        }
        return this;
    }

    /**
     * Returns a message handler.
     * @param messageName Message handler's name.
     * @returns A handler associated with the provided name, if it exists, otherwise `null`.
     */
    public getHandler(messageName: string): Nullable<IEvent>
    {
        return this._handlers.tryGet(messageName);
    }

    /**
     * Checks whether or not a message handler exists.
     * @param messageName Message handler's name.
     * @returns `true`, if message handler exists, otherwise `false`.
     */
    public hasHandler(messageName: string): boolean
    {
        return this._handlers.has(messageName);
    }

    /**
     * Adds a new message listener. Creates a new message handler, if it doesn't already exist.
     * @param messageName Name of the message handler to listen to.
     * @param delegate A delegate, that will be invoked when the message is published.
     * @throws An `Error`, if the message broker has been disposed.
     * @returns A new event listener.
     */
    public listen(messageName: string, delegate: EventDelegate): IEventListener
    {
        Assert.False(this._isDisposed, 'message broker has been disposed');
        const handler = this._handlers.getOrAdd(messageName, () => new EventHandler());
        const listener = handler.listen(delegate);
        return listener;
    }

    /**
     * Deletes and disposes a message handler. Does nothing, if the handler doesn't exist.
     * @param messageName Name of the message to publish.
     * @param sender Optional message sender.
     * @param payload Optional message payload.
     * @returns `this`
     */
    public publish(messageName: string, sender?: any, payload?: any): this
    {
        const handler = this._handlers.tryGet(messageName);
        if (!isNull(handler))
            handler.publish(sender, payload);

        return this;
    }

    /** Returns a collection of all registered message names. */
    public messageNames(): Iterable<string>
    {
        return this._handlers.keys();
    }
}
