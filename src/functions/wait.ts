/**
 * Returns an awaitable promise that resolves after the specified amount of time.
 * @param ms Time in milliseconds after which the returned promise resolves.
 * @returns Promise that resolves after the provided time.
 */
export async function wait(ms: number): Promise<void>
{
    return new Promise<void>(resolve => setTimeout(resolve, ms));
}
