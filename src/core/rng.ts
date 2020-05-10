/** A random number generator, allows to create pseudorandom numbers. */
export class Rng
    implements
    Iterable<number>
{
    /**
     * Generates a pseudorandom number in [`min`, `max`) range.
     * @param min Min value.
     * @param max Max value.
     * @returns A pseudorandom number.
     */
    public next(min: number, max: number): number
    {
        return Math.random() * (max - min) + min;
    }

    /**
     * Generates a pseudorandom integer in [`min`, `max`) range.
     * @param min Min value.
     * @param max Max value.
     * @returns A pseudorandom integer.
     */
    public nextInt(min: number, max: number): number
    {
        min = Math.ceil(min);
        max = Math.floor(max);

        if (min < Number.MIN_SAFE_INTEGER)
            min = Number.MIN_SAFE_INTEGER;

        if (max > Number.MAX_SAFE_INTEGER)
            max = Number.MAX_SAFE_INTEGER;

        return Math.trunc(this.next(min, max));
    }

    /**
     * Generates a pseudorandom boolean.
     * @returns A pseudorandom boolean.
     */
    public nextBoolean(): boolean
    {
        return Math.random() < 0.5;
    }

    public *[Symbol.iterator](): IterableIterator<number>
    {
        while (true)
            yield this.next(0, 1);
    }
}
