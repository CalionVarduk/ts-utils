import { EventHandler } from '../../src/events/event-handler';
import { EventDelegate, IEventListener, EventListenerOperator, IEvent } from '../../src/events/event.interface';
import { Nullable } from '../../src/types';
import { isDefined } from '../../src/functions';

class OperatorProvider
{
    public interceptedNext: Nullable<EventDelegate> = null;
    public interceptedListener: Nullable<IEventListener> = null;
    public result: Nullable<EventDelegate> = null;

    public interceptedSender: Nullable<any> = null;
    public interceptedArgs: Nullable<any> = null;
    public interceptedEvent: Nullable<IEvent> = null;

    public create(op?: () => void): EventListenerOperator
    {
        return (n, l) =>
        {
            this.interceptedNext = n;
            this.interceptedListener = l;
            this.result = (s, a, e) =>
                {
                    this.interceptedSender = s;
                    this.interceptedArgs = a!;
                    this.interceptedEvent = e;
                    if (isDefined(op))
                        op();
                    return n(s, a, e);
                };
            return this.result;
        };
    }
}

class DisposeOperatorProvider
{
    public interceptedNext: Nullable<EventDelegate> = null;
    public interceptedListener: Nullable<IEventListener> = null;

    public create(): EventListenerOperator
    {
        return (n, l) =>
        {
            this.interceptedNext = n;
            this.interceptedListener = l;
            l.dispose();
            return null;
        };
    }
}

test('ctor should create properly',
    () =>
    {
        const result = new EventHandler();
        expect(result.isDisposed).toBe(false);
        expect(result.listeners.length).toBe(0);
    }
);

test('dispose should remove all listeners',
    () =>
    {
        const handler = new EventHandler();
        const listener = handler.listen(() => {});

        handler.dispose();

        expect(handler.listeners.length).toBe(0);
        expect(handler.isDisposed).toBe(true);
        expect(listener.isDisposed).toBe(true);
    }
);

test('dispose invoked more than once should not throw',
    () =>
    {
        const handler = new EventHandler();

        handler.dispose();
        const action = () => handler.dispose();

        expect(action).not.toThrow();
        expect(handler.listeners.length).toBe(0);
        expect(handler.isDisposed).toBe(true);
    }
);

test('listen should register a new listener',
    () =>
    {
        const delegate: EventDelegate = () => {};
        const handler = new EventHandler();

        const result = handler.listen(delegate);

        expect(result.isDisposed).toBe(false);
        expect(result.delegate).toBe(delegate);
        expect((result as any).invoke).toBe(delegate);
        expect(handler.listeners.length).toBe(1);
        expect(handler.listeners).toContain(result);
    }
);

test('listen should throw when invoked on disposed event handler',
    () =>
    {
        const handler = new EventHandler();
        handler.dispose();

        const action = () => handler.listen(() => {});

        expect(action).toThrow();
    }
);

test('listen invoked inside listener delegate should add another listener properly',
    () =>
    {
        let isFirstListenerInvoked = false;
        let isSecondListenerInvoked = false;
        let isThirdListernerInvoked = false;
        let isFourthListernerInvoked = false;

        let fourthListener: Nullable<IEventListener> = null;

        const handler = new EventHandler();
        const firstListener = handler.listen(() => isFirstListenerInvoked = true);
        handler.listen(() =>
        {
            isSecondListenerInvoked = true;
            firstListener.dispose();
            handler.listen(() => isThirdListernerInvoked = true);
            fourthListener!.dispose();
        });
        fourthListener = handler.listen(() => isFourthListernerInvoked = true);

        handler.publish();

        expect(isFirstListenerInvoked).toBe(true);
        expect(isSecondListenerInvoked).toBe(true);
        expect(isThirdListernerInvoked).toBe(false);
        expect(isFourthListernerInvoked).toBe(false);
    }
);

test('publish should invoke listeners correctly',
    () =>
    {
        const args = 'foo';
        const sender = {};

        let interceptedSender: Nullable<any> = null;
        let interceptedArgs: Nullable<string> = null;
        let interceptedEvent: Nullable<IEvent<string>> = null;

        const handler = new EventHandler<string>();
        handler.listen((s, a, e) =>
        {
            interceptedSender = s;
            interceptedArgs = a!;
            interceptedEvent = e;
        });

        handler.publish(sender, args);

        expect(interceptedSender).toBe(sender);
        expect(interceptedArgs).toBe(args);
        expect(interceptedEvent).toBe(handler);
    }
);

test('IEventListener.decorate should modify the listener properly',
    () =>
    {
        const args = 'foo';
        const sender = {};
        const delegate: EventDelegate = () => {};

        const firstProvider = new OperatorProvider();
        const secondProvider = new OperatorProvider();

        const handler = new EventHandler();
        const listener = handler.listen(delegate);

        const result = listener.decorate(firstProvider.create(), secondProvider.create());

        handler.publish(sender, args);

        expect(listener.delegate).toBe(delegate);
        expect((listener as any).invoke).toBe(firstProvider.result);
        expect(firstProvider.interceptedNext).not.toBeNull();
        expect(firstProvider.interceptedListener).toBe(listener);
        expect(firstProvider.interceptedSender).toBe(sender);
        expect(firstProvider.interceptedArgs).toBe(args);
        expect(firstProvider.interceptedEvent).toBe(handler);
        expect(secondProvider.interceptedNext).not.toBeNull();
        expect(secondProvider.interceptedListener).toBe(listener);
        expect(secondProvider.interceptedSender).toBe(sender);
        expect(secondProvider.interceptedArgs).toBe(args);
        expect(secondProvider.interceptedEvent).toBe(handler);
        expect(result).toBe(listener);
    }
);

test('IEventListener.decorate should do nothing when listener is disposed',
    () =>
    {
        const provider = new OperatorProvider();

        const handler = new EventHandler();
        const listener = handler.listen(() => {});
        listener.dispose();

        const result = listener.decorate(provider.create());

        expect(provider.interceptedNext).toBeNull();
        expect(provider.interceptedListener).toBeNull();
        expect(result).toBe(listener);
    }
);

test('IEventListener.decorate should stop applying operators the moment one disposes the listener immediately',
    () =>
    {
        const delegate: EventDelegate = () => {};
        const firstProvider = new DisposeOperatorProvider();
        const secondProvider = new OperatorProvider();

        const handler = new EventHandler();
        const listener = handler.listen(delegate);

        const result = listener.decorate(firstProvider.create(), secondProvider.create());

        expect(firstProvider.interceptedNext).not.toBeNull();
        expect(firstProvider.interceptedListener).toBe(listener);
        expect(secondProvider.interceptedNext).toBeNull();
        expect(secondProvider.interceptedListener).toBeNull();
        expect(result).toBe(listener);
    }
);

test('IEventListener.decorate should ignore operators returning null',
    () =>
    {
        const delegate: EventDelegate = () => {};
        const handler = new EventHandler();
        const listener = handler.listen(delegate);

        const result = listener.decorate(() => null);

        expect((listener as any).invoke).toBe(delegate);
        expect(listener.delegate).toBe(delegate);
        expect(result).toBe(listener);
    }
);

test('IEventListener.decorate should setup operators to be invoked sequentially, followed by the delegate',
    () =>
    {
        let order = 0;
        const orderOfOperatorCall: number[] = [-1, -1, -1, -1, -1];

        const delegate: EventDelegate = () => orderOfOperatorCall[4] = order++;
        const firstOperator = new OperatorProvider().create(() => orderOfOperatorCall[0] = order++);
        const secondOperator = new OperatorProvider().create(() => orderOfOperatorCall[1] = order++);
        const thirdOperator = new OperatorProvider().create(() => orderOfOperatorCall[2] = order++);
        const fourthOperator = new OperatorProvider().create(() => orderOfOperatorCall[3] = order++);

        const handler = new EventHandler();
        handler.listen(delegate)
            .decorate(firstOperator, secondOperator)
            .decorate(thirdOperator, fourthOperator);

        handler.publish();

        expect(orderOfOperatorCall).toMatchObject([0, 1, 2, 3, 4]);
    }
);

test('IEventListener.dispose should remove listener properly',
    () =>
    {
        const delegate: EventDelegate = () => {};
        const handler = new EventHandler();

        const result = handler.listen(delegate);
        result.dispose();

        expect(result.isDisposed).toBe(true);
        expect(result.delegate).toBe(delegate);
        expect(handler.listeners.length).toBe(0);
    }
);

test('IEventListener.dispose invoked more than once should not throw',
    () =>
    {
        const handler = new EventHandler();

        const result = handler.listen(() => {});
        result.dispose();
        const action = () => result.dispose();

        expect(action).not.toThrow();
        expect(result.isDisposed).toBe(true);
        expect(handler.listeners.length).toBe(0);
    }
);
