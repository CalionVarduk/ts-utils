import { EventHandler, EventDelegate, IEvent } from '../core/event';

type Args = { a: string };

class Delegate
{
    public isInvoked: boolean = false;
    public sender?: any = void(0);
    public event?: IEvent<string, Args> = void(0);
    public args?: Args = void(0);

    public readonly function: EventDelegate<string, Args> = (e, s, a) =>
    {
        this.sender = s;
        this.event = e;
        this.args = a;
        this.isInvoked = true;
    }
}

test('ctor should create properly',
    () =>
    {
        const type = 'event';
        const handler = new EventHandler<string>(type);
        expect(handler.type).toBe(type);
        expect(handler.listeners.length).toBe(0);
        expect(handler.listenerCount).toBe(0);
    }
);

test('add listener should push listener to the current listeners collection',
    () =>
    {
        const listener1 = () => {};
        const listener2 = () => {};
        const listener3 = () => {};
        const handler = new EventHandler<number>(0);
        handler.addListener(listener1);
        handler.addListener(listener2);
        handler.addListener(listener3);
        expect(handler.listenerCount).toBe(3);
        expect(handler.listeners.length).toBe(3);
        expect(handler.listeners[0]).toBe(listener1);
        expect(handler.listeners[1]).toBe(listener2);
        expect(handler.listeners[2]).toBe(listener3);
    }
);

test('contains listener should return true if listener exists',
    () =>
    {
        const listener = () => {};
        const handler = new EventHandler<number>(0);
        handler.addListener(listener);
        const result = handler.containsListener(listener);
        expect(result).toBe(true);
    }
);

test('contains listener should return false if listener does\'t exist',
    () =>
    {
        const listener = () => {};
        const handler = new EventHandler<number>(0);
        handler.addListener(listener);
        const result = handler.containsListener(() => {});
        expect(result).toBe(false);
    }
);

test('remove listener should remove listener from the current listeners collection',
    () =>
    {
        const listener1 = () => {};
        const listener2 = () => {};
        const listener3 = () => {};
        const handler = new EventHandler<number>(0);
        handler.addListener(listener1);
        handler.addListener(listener2);
        handler.addListener(listener3);
        handler.addListener(listener2);
        const result = handler.removeListener(listener2);
        expect(result).toBe(true);
        expect(handler.listenerCount).toBe(2);
        expect(handler.listeners.length).toBe(2);
        expect(handler.listeners[0]).toBe(listener1);
        expect(handler.listeners[1]).toBe(listener3);
    }
);

test('remove listener should do nothing if listener doesn\'t exist',
    () =>
    {
        const listener1 = () => {};
        const listener2 = () => {};
        const listener3 = () => {};
        const handler = new EventHandler<number>(0);
        handler.addListener(listener1);
        handler.addListener(listener2);
        const result = handler.removeListener(listener3);
        expect(result).toBe(false);
        expect(handler.listenerCount).toBe(2);
        expect(handler.listeners.length).toBe(2);
        expect(handler.listeners[0]).toBe(listener1);
        expect(handler.listeners[1]).toBe(listener2);
    }
);

test('clear should remove all listeners',
    () =>
    {
        const listener1 = () => {};
        const listener2 = () => {};
        const listener3 = () => {};
        const handler = new EventHandler<number>(0);
        handler.addListener(listener1);
        handler.addListener(listener2);
        handler.addListener(listener3);
        handler.clear();
        expect(handler.listenerCount).toBe(0);
        expect(handler.listeners.length).toBe(0);
    }
);

test('publish should call all listeners with proper arguments',
    () =>
    {
        const sender = { sender: 'sender' };
        const args: Args = { a: 'a' };
        const delegate1 = new Delegate();
        const delegate2 = new Delegate();
        const handler = new EventHandler<string, Args>('event');
        handler.addListener(delegate1.function);
        handler.addListener(delegate2.function);
        handler.publish(sender, args);
        expect(delegate1.isInvoked).toBe(true);
        expect(delegate1.sender).toBe(sender);
        expect(delegate1.event).toBe(handler);
        expect(delegate1.args).toBe(args);
        expect(delegate2.isInvoked).toBe(true);
        expect(delegate2.sender).toBe(sender);
        expect(delegate2.event).toBe(handler);
        expect(delegate2.args).toBe(args);
    }
);
