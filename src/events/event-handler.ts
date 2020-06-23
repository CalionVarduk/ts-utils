import { IEvent, EventDelegate, IEventListener, EventListenerOperator } from './event.interface';
import { Nullable } from '../types';
import { isNull, Assert } from '../functions';
import { IDisposable } from '../disposable.interface';

type Operator<TArgs> =
{
    readonly delegate: EventDelegate<TArgs>;
    index: number;
};

class EventListener<TArgs = any>
    implements
    IEventListener<TArgs>
{
    public get isDisposed(): boolean
    {
        return isNull(this._disposer);
    }

    public get invoke(): EventDelegate<TArgs>
    {
        return this._operators[0].delegate;
    }

    public get delegate(): EventDelegate<TArgs>
    {
        return this._operators[this._operators.length - 1].delegate;
    }

    private _disposer: Nullable<() => void>;

    private readonly _operators: Operator<TArgs>[];

    public constructor(
        delegate: EventDelegate<TArgs>,
        listeners: IEventListener<TArgs>[])
    {
        this._operators = [{
            delegate: delegate,
            index: 0
        }];
        this._disposer = () =>
            {
                const index = listeners.findIndex(l => l === this);
                if (index !== -1)
                    listeners.splice(index, 1);

                this._disposer = null;
                this._operators.splice(0, this._operators.length - 1);
            };
    }

    public dispose(): void
    {
        if (!isNull(this._disposer))
            this._disposer();
    }

    public decorate(...operators: EventListenerOperator<TArgs>[]): this
    {
        if (this.isDisposed)
            return this;

        let nextOperatorIndex = this._operators.length - 1;
        const newOperators: Operator<TArgs>[] = [];

        for (let i = 0; i < operators.length; ++i)
        {
            let operatorData: Nullable<Operator<TArgs>> = null;
            const next: EventDelegate = (s, a, e) => this._operators[operatorData!.index + 1].delegate(s, a, e);
            const result = operators[i](next, this);

            if (this.isDisposed)
                return this;

            if (isNull(result))
                continue;

            operatorData = {
                delegate: result,
                index: nextOperatorIndex++
            };
            newOperators.push(operatorData);
        }
        this._operators.splice(this._operators.length - 1, 0, ...newOperators);
        return this;
    }
}

/** Represents an event that can be published and listened to. */
export class EventHandler<TArgs = any>
    implements
    IEvent<TArgs>,
    IDisposable
{
    public get listeners(): ReadonlyArray<IEventListener<TArgs>>
    {
        return this._listeners;
    }

    public get isDisposed(): boolean
    {
        return this._isDisposed;
    }

    private readonly _listeners: EventListener<TArgs>[];
    private _isDisposed: boolean;

    /**
     * Creates a new EventHandler object.
     */
    public constructor()
    {
        this._listeners = [];
        this._isDisposed = false;
    }

    public dispose(): void
    {
        if (this._isDisposed)
            return;

        const listeners = [...this._listeners];
        this._listeners.splice(0, this._listeners.length);

        for (const listener of listeners)
            listener.dispose();

        this._isDisposed = true;
    }

    public listen(delegate: EventDelegate<TArgs>): IEventListener<TArgs>
    {
        Assert.False(this._isDisposed, 'cannot listen to a disposed event.');
        const result = new EventListener<TArgs>(delegate, this._listeners);
        this._listeners.push(result);
        return result;
    }

    /**
     * Publishes the event.
     * @param sender Optional event sender.
     * @param args Optional event arguments.
     * @returns `this`.
     */
    public publish(sender?: any, args?: TArgs): this
    {
        for (const listener of [...this._listeners])
        {
            if (listener.isDisposed)
                continue;

            listener.invoke(sender, args, this);
        }
        return this;
    }
}
