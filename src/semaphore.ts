import { Assert } from './functions';
import { Queue } from './collections/queue';

type Unlocker = () => void;

/** Represents a semaphore variable, that allows to restrict simultaneous access to a resource. */
export class Semaphore
{
    /**
     * Specifies the semaphore's currently remaining resource accesses.
     * A value less than or equal to 0 means, that any other resource accessors will have to wait for the semaphore to release enough locks,
     * before being granted access.
     * */
    public get value(): number
    {
        return this._value;
    }

    /** Specifies the semaphore's max allowed simultaneous resource accesses. */
    public readonly count: number;

    private readonly _unlockers: Queue<Unlocker>;
    private _value: number;

    /**
     * Creates a new Semaphore object.
     * @param count Max allowed simultaneous resource accesses.
     * @throws An `Error`, if `count` is less than 1.
     */
    public constructor(count: number)
    {
        Assert.True(count >= 1, 'count must be greater than or equal to 1');
        this.count = Math.trunc(count);
        this._value = this.count;
        this._unlockers = new Queue<Unlocker>();
    }

    /**
     * Dispatches an action and waits for enough locks to be released by the semaphore before invoking it, if necessary.
     * @param action An action to dispatch.
     * @returns A promise containing dispatched action's result.
     */
    public async dispatch<T>(action: (() => Promise<T>) | (() => T)): Promise<T>
    {
        const unlock = await this._lock();
        try
        {
            return await Promise.resolve(action());
        }
        finally
        {
            unlock();
        }
    }

    private _lock(): Promise<Unlocker>
    {
        const unlocker: Unlocker = () =>
        {
            ++this._value;
            if (!this._unlockers.isEmpty)
                this._unlockers.pop()();
        };

        return --this._value >= 0 ?
            Promise.resolve(unlocker) :
            new Promise<Unlocker>(resolve => this._unlockers.push(() => resolve(unlocker)));
    }
}

/** Represents a mutex variable, that restricts simultaneous resource access to exactly one accessor. */
export class Mutex
    extends
    Semaphore
{
    /**
     * Creates a new Mutex object.
     */
    public constructor()
    {
        super(1);
    }
}
