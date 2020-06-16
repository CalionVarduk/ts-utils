import { EventHandler } from '../../core/events/event-handler';
import { skipWhile } from '../../core/events/operators/skip-while';
import { IEvent } from '../../core/events/event.interface';
import { Iteration } from '../../core/collections/iteration';
import each from 'jest-each';

each([
    [['foo'], 1],
    [['foo', 'bar'], 2],
    [['foo', 'bar', 'baz'], 3],
    [[''], 0]
])
.test('skipWhile operator should skip starting published events correctly (%#): skip while args: %o, expected skip count: %f',
    (skipWhileArgs: string[], expectedSkipCount: number) =>
    {
        const args = ['foo', 'bar', 'baz'];
        const senders = [{}, 0, ''];

        const interceptedFilterData: { sender: any; args: any; event: IEvent }[] = [];
        const interceptedData: { sender: any; args: any; event: IEvent }[] = [];

        const handler = new EventHandler();

        handler.listen((s, a, e) => interceptedData.push({ sender: s, args: a, event: e }))
            .decorate(skipWhile((s, a, e) =>
            {
                interceptedFilterData.push({ sender: s, args: a, event: e });
                return skipWhileArgs.some(arg => arg === a);
            }));

        for (const data of Iteration.Zip(senders, args))
            handler.publish(data.first, data.second);

        expect(interceptedFilterData.length).toBe(Math.min(args.length, expectedSkipCount + 1));
        for (let i = 0; i < interceptedFilterData.length; ++i)
        {
            expect(interceptedFilterData[i].sender).toBe(senders[i]);
            expect(interceptedFilterData[i].args).toBe(args[i]);
            expect(interceptedFilterData[i].event).toBe(handler);
        }

        expect(interceptedData.length).toBe(args.length - expectedSkipCount);
        for (let i = expectedSkipCount; i < args.length; ++i)
        {
            expect(interceptedData[i - expectedSkipCount].sender).toBe(senders[i]);
            expect(interceptedData[i - expectedSkipCount].args).toBe(args[i]);
            expect(interceptedData[i - expectedSkipCount].event).toBe(handler);
        }
    }
);
