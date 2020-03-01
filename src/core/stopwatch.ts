import { Flag } from './flag';

/** Represents an object that allows to measure the passage of time. */
export class StopWatch
{
    /** Returns whether or not the stopwatch is currently running. */
    public get isRunning(): boolean
    {
        return this._isRunning.value;
    }

    /** Returns the starting point in time of the stopwatch. */
    public get startPointMs(): number
    {
        return this._startPointMs;
    }

    /** Returns the current end point in time of the stopwatch. */
    public get endPointMs(): number
    {
        return this.isRunning ? Date.now() : this._endPointMs;
    }

    /** Returns the currently elapsed measured time by the stopwatch. */
    public get elapsedMs(): number
    {
        return this.endPointMs - this.startPointMs;
    }

    private readonly _isRunning: Flag;
    private _startPointMs: number;
    private _endPointMs: number;

    /**
     * Creates a new stopwatch object.
     * @param start if `true`, then the new stopwatch object starts activated
     */
    public constructor(start?: boolean)
    {
        this._startPointMs = Date.now();
        this._endPointMs = this._startPointMs;
        this._isRunning = new Flag(start === true);
    }

    /**
     * Starts the stopwatch, if it isn't running already.
     * @returns `true` if the stopwatch hasn't been running already, otherwise `false`
     */
    public start(): boolean
    {
        if (this._isRunning.exchange(true))
            return false;

        this._setupTimePoints();
        return true;
    }

    /**
     * Stops the stopwatch, if it is running.
     * @returns `true` if the stopwatch was running, otherwise `false`
     */
    public stop(): boolean
    {
        if (!this._isRunning.exchange(false))
            return false;

        this._endPointMs = Date.now();
        return true;
    }

    /**
     * Restarts the stopwatch, even if it is running already.
     */
    public restart(): void
    {
        this._isRunning.update(true);
        this._setupTimePoints();
    }

    private _setupTimePoints(): void
    {
        this._startPointMs = Date.now();
        this._endPointMs = this._startPointMs;
    }
}
