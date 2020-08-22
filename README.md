# FRL TypeScript utils

[![Build Status](https://travis-ci.com/CalionVarduk/ts-utils.png?branch=master)](https://travis-ci.com/CalionVarduk/ts-utils)
[![Coverage Status](https://coveralls.io/repos/github/CalionVarduk/ts-utils/badge.svg)](https://coveralls.io/github/CalionVarduk/ts-utils)
[![npm version](https://badge.fury.io/js/frl-ts-utils.svg)](https://www.npmjs.com/package/frl-ts-utils)
[![Dependency status](https://david-dm.org/CalionVarduk/ts-utils/status.svg)](https://david-dm.org/CalionVarduk/ts-utils)
[![Dev Dependency Status](https://david-dm.org/CalionVarduk/ts-utils/dev-status.svg)](https://david-dm.org/CalionVarduk/ts-utils?type=dev)
[![License](https://img.shields.io/github/license/mashape/apistatus.svg)](https://github.com/CalionVarduk/ts-utils/blob/master/LICENSE)

This little project contains a few quality-of-life TypeScript utilities.

## A. Installation

If you are using `npm`, then simply run the `npm install frl-ts-utils` CLI command to get the latest version.

If you are using `yarn`, then go with the `yarn add frl-ts-utils` command.

## B. Types

- [Comparer\<T\>](https://github.com/CalionVarduk/ts-utils/blob/master/src/types/comparer.ts#L4) - represents a comparer delegate of two objects of type `T`.

- [DeepReadonly\<T\>](https://github.com/CalionVarduk/ts-utils/blob/master/src/types/deep-readonly.ts#L5) - represents a deep readonly `T` type.

- [IDeepReadonlyArray\<T\>](https://github.com/CalionVarduk/ts-utils/blob/master/src/types/deep-readonly.ts#L18) - an interface that extends the `ReadonlyArray<DeepReadonly<T>>` interface.

- [IDeepReadonlyMap\<K, V\>](https://github.com/CalionVarduk/ts-utils/blob/master/src/types/deep-readonly.ts#L21) - an interface that extends the `ReadonlyMap<DeepReadonly<K>, DeepReadonly<V>>` interface.

- [IDeepReadonlySet\<T\>](https://github.com/CalionVarduk/ts-utils/blob/master/src/types/deep-readonly.ts#L24) - an interface that extends the `ReadonlySet<DeepReadonly<T>>` interface.

- [Delegate\<TArgs, TReturnType\>](https://github.com/CalionVarduk/ts-utils/blob/master/src/types/delegate.ts#L2) - represents a delegate type, that returns `TReturnType` and has parameters with types represented by the `TArgs` tuple.

- [ExtractDelegate\<T\>](https://github.com/CalionVarduk/ts-utils/blob/master/src/types/delegate.ts#L6) - allows to extract `Delegate<TArgs, TReturnType>` type from `T`.

- [EmptyObject](https://github.com/CalionVarduk/ts-utils/blob/master/src/types/empty-object.ts#L2) - represents an object with no properties.

- [Ensured<T>](https://github.com/CalionVarduk/ts-utils/blob/master/src/types/ensured.ts#L4) - removes `null` and `undefined` from type `T`.

- [EqualityComparer\<T\>](https://github.com/CalionVarduk/ts-utils/blob/master/src/types/equality-comparer.ts#L4) - represents an equality comparer delegate of two objects of type `T`.

- [KeyOfType\<TType, TPropertyType\>](https://github.com/CalionVarduk/ts-utils/blob/master/src/types/key-of.ts#L7) - represents names of `TType` members that are of `TPropertyType` type.

- [MethodKeyOf\<TType\>](https://github.com/CalionVarduk/ts-utils/blob/master/src/types/key-of.ts#L18) - represents names of `TType` members that are of `Function` type.

- [PropertyKeyOf\<TType\>](https://github.com/CalionVarduk/ts-utils/blob/master/src/types/key-of.ts#L24) - represents names of `TType` members that are not of `Function` type.

- [RequiredKeyOf\<TType\>](https://github.com/CalionVarduk/ts-utils/blob/master/src/types/key-of.ts#L30) - represents names of `TType` members that are not nullable and not undefinable.

- [OptionalKeyOf\<TType\>](https://github.com/CalionVarduk/ts-utils/blob/master/src/types/key-of.ts#L41) - represents names of `TType` members that are nullable and/or undefinable.

- [RequiredKeyOfType\<TType, TPropertyType\>](https://github.com/CalionVarduk/ts-utils/blob/master/src/types/key-of.ts#L47) - represents names of `TType` members that are not nullable and not undefinable, and that are of `TPropertyType` type.

- [OptionalKeyOfType\<TType, TPropertyType\>](https://github.com/CalionVarduk/ts-utils/blob/master/src/types/key-of.ts#L58) - represents names of `TType` members that are nullable and/or undefinable, and that are of `TPropertyType` type.

- [MemberKey](https://github.com/CalionVarduk/ts-utils/blob/master/src/types/member-key.ts#L2) - represents a union type of `string`, `number` and `symbol`.

- [None](https://github.com/CalionVarduk/ts-utils/blob/master/src/types/none.ts#L2) - represents a union type of `null` and `undefined`.

- [NotNull\<T\>](https://github.com/CalionVarduk/ts-utils/blob/master/src/types/not-null.ts#L2) - removed `null` from type `T`.

- [NotUndefined\<T\>](https://github.com/CalionVarduk/ts-utils/blob/master/src/types/not-undefined.ts#L2) - removed `undefined` from type `T`.

- [Nullable\<T\>](https://github.com/CalionVarduk/ts-utils/blob/master/src/types/nullable.ts#L2) - represents a union type of `T` and `null`.

- [ObjectType\<T\>](https://github.com/CalionVarduk/ts-utils/blob/master/src/types/object-type.ts#L2) - represents a constructor of type `T`.

- [AbstractObjectType\<T\>](https://github.com/CalionVarduk/ts-utils/blob/master/src/types/object-type.ts#L5) - represents a constructor of an abstract type `T`.

- [Optional\<T\>](https://github.com/CalionVarduk/ts-utils/blob/master/src/types/optional.ts#L5) - represents a union type of `T`, `null` and `undefined`.

- [Primitive](https://github.com/CalionVarduk/ts-utils/blob/master/src/types/primitive.ts#L2) - represents a union type of `string`, `number` and `boolean`.

- [PrimitiveTypesMap](https://github.com/CalionVarduk/ts-utils/blob/master/src/types/primitive.ts#L5) - represents a name-to-type map for primitive types.

- [PrimitiveTypeNames](https://github.com/CalionVarduk/ts-utils/blob/master/src/types/primitive.ts#L17) - represents a union of primitive type names.

- [Ref\<T\>](https://github.com/CalionVarduk/ts-utils/blob/master/src/types/ref.ts#L2) - represents a reference type for value type `T`.

- [Reject\<T, K\>](https://github.com/CalionVarduk/ts-utils/blob/master/src/types/reject.ts#L2) - represents a type with all properties from `T`, without properties with keys from `K`.

- [Replace\<T, U\>](https://github.com/CalionVarduk/ts-utils/blob/master/src/types/replace.ts#L4) - represents a type with all properties from `T`, where properties with the same key as in the `U` type are replaced by the `U` type. 

- [Stringifier\<T\>](https://github.com/CalionVarduk/ts-utils/blob/master/src/types/stringifier.ts#L4) - represents a delegate that converts an object of type `T` to `string`.

- [TypeInstance\<TType\>](https://github.com/CalionVarduk/ts-utils/blob/master/src/types/type-instance.ts#L5) - represents an instance type of either an `ObjectType<T>` or `PrimitiveTypeNames` type.

- [Undefinable\<T\>](https://github.com/CalionVarduk/ts-utils/blob/master/src/types/undefinable.ts#L2) - represents a union type of `T` and `undefined`.

## C. Functions

- [makeRef\<T\>](https://github.com/CalionVarduk/ts-utils/blob/master/src/types/ref.ts#L13) - creates a new `Ref<T>` object with the provided value.

- [toDeepReadonly\<T\>](https://github.com/CalionVarduk/ts-utils/blob/master/src/types/deep-readonly.ts#L31) - casts an object of type `T` to type `DeepReadonly<T>`.

- [isDisposable](https://github.com/CalionVarduk/ts-utils/blob/master/src/disposable.interface.ts#L15) - checks whether or not an object implements an `IDisposable` interface by having a method called `dispose`.

- [Assert](https://github.com/CalionVarduk/ts-utils/blob/master/src/functions/assert.ts#L21) - a namespace containing a few useful assertion functions. These assertion functions either pass and return the provided parameter (except for [Assert.True](https://github.com/CalionVarduk/ts-utils/blob/master/src/functions/assert.ts#L171) and [Assert.False](https://github.com/CalionVarduk/ts-utils/blob/master/src/functions/assert.ts#L183) functions) or throw an `Error`.

- [createIterable\<T\>](https://github.com/CalionVarduk/ts-utils/blob/master/src/functions/create-iterable.ts#L6) - creates an `Iterable<T>` object from the provided iterator factory.

- [deepFreeze\<T\>](https://github.com/CalionVarduk/ts-utils/blob/master/src/functions/deep-freeze.ts#L11) - recursively deep freezes the provided object and its properties, and returns it as `DeepReadonly<T>`.

- [dynamicCast\<T\>](https://github.com/CalionVarduk/ts-utils/blob/master/src/functions/dynamic-cast.ts#L20) - allows to safely cast an object to the specified type, otherwise returns `null`. Works for object and primitive types.

A few examples:
```typescript
class Foo {}
class Bar extends Foo {}

const foo: Foo = new Bar();
// returns foo as a Bar object
const bar = dynamicCast(Bar, foo);
// returns null
const nullDate = dynamicCast(Date, foo);
// returns null as well
const nullStr = dynamicCast('string', foo);

const obj: any = 'string';
// returns obj as a string
const str = dynamicCast('string', obj);
// returns null
const nullNumber = dynamicCast('number', obj);
// returns null as well
const nullBar = dynamicCast(Bar, obj);
```

It works for generic types too, however the generic parameters won't be validated:
```typescript
class Generic<T>
{
    public constructor(public value: T) {}
}

const foo = new Generic<number>(0);

// returns foo as a Generic<string> object
// note, how the result type has to specified explicitly
// otherwise, the resulting type would be Generic<unknown>
// which may, or may not be, something you want
const bar = dynamicCast<Generic<string>>(Generic, foo);

const str = 'foo';
// returns null
const nullStr = dynamicCast<Generic<Date>>(Generic, str);
```

- [isOfType\<T\>](https://github.com/CalionVarduk/ts-utils/blob/master/src/functions/dynamic-cast.ts#L36) - allows to check, if an object is of specified type. Works for object and primitive types. This is very similar to the `dynamicCast<T>` function, however, instead of returning a cast object or `null`, it returns `true` or `false` instead, respectively.

- [extend\<T\>](https://github.com/CalionVarduk/ts-utils/blob/master/src/functions/extend.ts#L12) - creates a function extension.

- [instanceOfCast\<T\>](https://github.com/CalionVarduk/ts-utils/blob/master/src/functions/instance-of-cast.ts#L21) - allows to safely cast an object to the specified type, otherwise returns `null`. Works for object types only.

An example:
```typescript
class Foo {}
class Bar extends Foo {}

const foo: Foo = new Bar();
// returns foo as a Bar object
const bar = instanceOfCast(Bar, foo);
// returns null
const nullDate = instanceOfCast(Date, foo);
```

Similar to `dynamicCast<T>`, it works for generic types too:
```typescript
class Generic<T>
{
    public constructor(public value: T) {}
}

const foo = new Generic<number>(0);

// returns foo as a Generic<string> object
// note, how the result type has to specified explicitly
// otherwise, the resulting type would be Generic<unknown>
// which may, or may not be, something you want
const bar = instanceOfCast<Generic<string>>(Generic, foo);

const date = new Date();
// returns null
const nullDate = instanceOfCast<Generic<boolean>>(Generic, date);
```

- [isInstanceOfType\<T\>](https://github.com/CalionVarduk/ts-utils/blob/master/src/functions/instance-of-cast.ts#L10) - allows to check, if an object is of specified type. Works for object types only. This is very similar to the `instanceOfCast<T>` function, however, instead of returning a cast object or `null`, it returns `true` or `false` instead, respectively.

- [isDefined\<T\>](https://github.com/CalionVarduk/ts-utils/blob/master/src/functions/is-defined.ts#L10) - returns `true`, if an object is not `null` and not `undefined`, otherwise returns `false`.

- [isNull\<T\>](https://github.com/CalionVarduk/ts-utils/blob/master/src/functions/is-null.ts#L8) - returns `true`, if an object is `null`, otherwise returns `false`.

- [isUndefined\<T\>](https://github.com/CalionVarduk/ts-utils/blob/master/src/functions/is-undefined.ts#L8) - returns `true`, if an object is `undefined`, otherwise returns `false`.

- [primitiveCast\<T\>](https://github.com/CalionVarduk/ts-utils/blob/master/src/functions/primitive-cast.ts#L21) - allows to safely cast an object to the specified type, otherwise returns `null`. Works for primitive types only.

An example:
```typescript
const obj: any = 'string';
// returns obj as a string
const str = primitiveCast('string', obj);
// returns null
const nullNumber = primitiveCast('number', obj);
```

- [isPrimitiveOfType\<T\>](https://github.com/CalionVarduk/ts-utils/blob/master/src/functions/primitive-cast.ts#L10) - allows to check, if an object is of specified type. Works for primitive types only. This is very similar to the `primitiveCast<T>` function, however, instead of returning a cast object or `null`, it returns `true` or `false` instead, respectively.

- [readonlyCast\<T\>](https://github.com/CalionVarduk/ts-utils/blob/master/src/functions/readonly-cast.ts#L9) - allows to force cast a `Readonly<T>` object to `T` type.
<br/>**Be careful while using this function, since Readonly objects are probably marked as readonly for a reason (or are frozen) and are not supposed to be mutated within the scope.**

- [deepReadonlyCast\<T\>](https://github.com/CalionVarduk/ts-utils/blob/master/src/functions/readonly-cast.ts#L19) - allows to force cast a `DeepReadonly<T>` object to `T` type.
<br/>**Be careful while using this function, since DeepReadonly objects are probably marked as deep readonly for a reason (or are deep-frozen) and are not supposed to be mutated within the scope.**

- [reinterpretCast\<T\>](https://github.com/CalionVarduk/ts-utils/blob/master/src/functions/reinterpret-cast.ts#L6) - allows to force cast an object to the specified type.
<br/>**Be very careful while using this function, because it allows you to cast any object to any type, which may cause the compilation process not to catch an obvious error.**

An example:
```typescript
class Bar {}

const bar = new Bar();
// this is a valid usage, however unfortunate it may be
const result = reinterpretCast<string>(bar);
result.trim(); // runtime error, instead of a compilation error
```

- [using\<T\>](https://github.com/CalionVarduk/ts-utils/blob/master/src/functions/using.ts#L29) - performs an action on an `IDisposable` object, and disposes it right after.

- [usingAsync\<T\>](https://github.com/CalionVarduk/ts-utils/blob/master/src/functions/using.ts#L64) - performs an asynchronous action on an `IDisposable` object, and disposes it right after.

- [wait](https://github.com/CalionVarduk/ts-utils/blob/master/src/functions/wait.ts#L6) - creates a promise that resolves after the specified amount of time (in milliseconds).

## D. Classes & Interfaces

- [DeferredAction\<TArgs\>](https://github.com/CalionVarduk/ts-utils/blob/master/src/deferred-action.ts#L14) - represents an action that should be invoked after a specified amount of time has passed. This class allows e.g. to create a simple debouncing mechanism, since every new invocation request resets the timer.

An example:
```typescript
// creates an action that executes after ~100ms
const deferred = new DeferredAction<string>({
    timeoutMs: 100,
    action: args => console.log('action invoked', args)
});

// invokes the action and starts the timeout
// after ~100ms, 'action invoked' 'foo' will be logged to the console...
deferred.invoke('foo');

// ... unless, the stop method is called before the timeout finishes, or...
deferred.stop();

// ... another invocation is called
deferred.invoke('bar');
```

- [IDisposable](https://github.com/CalionVarduk/ts-utils/blob/master/src/disposable.interface.ts#L4) - represents a disposable object.

- [Flag\<T\>](https://github.com/CalionVarduk/ts-utils/blob/master/src/flag.ts#L2) - represents a simple flag or switch object, whose value can be changed.

An example:
```typescript
// creates a boolean flag with initial value set to false
const flag = new Flag<boolean>(false);

// update method allows to change the flag's value
flag.update(true);

// exchange also changes the flag's value, however, it also returns the old value
// here, the old variable will be equal to true
const old = flag.exchange(false); 

// current will be equal to false
const current = flag.value;
```

- [Lazy\<T\>](https://github.com/CalionVarduk/ts-utils/blob/master/src/lazy.ts#L4) - represents a lazily initialized object.

An example:
```typescript
// creates a new lazy object
const lazy = new Lazy(() => 'foo');

// isCreated will be equal to false, since value hasn't been initialized yet
const isCreated = lazy.isValueCreated;

// calling value property's getter will invoke the provider and return 'foo'
// subsequent calls to value's getter will no longer call the provider,
// since the lazy object will cache its result
const value = lazy.value;
```

- [Mixin\<T\>](https://github.com/CalionVarduk/ts-utils/blob/master/src/mixin.ts#L17) - represents a mixin object that can be merged together with other objects.

- [RepeatedAction\<TArgs\>](https://github.com/CalionVarduk/ts-utils/blob/master/src/repeated-action.ts#L23) - represents a stoppable action that is continuously invoked at a specified interval. This class allows e.g. to create a simple polling mechanism, that stops after a desired result has been achieved.

An example:
```typescript
let i = 0;

// creates an action that executes every ~100ms, while i < 100
const repeated = new RepeatedAction<string>({
    intervalMs: 100,
    action: args =>
    {
        console.log('action invoked', i++, args);
        // returning RepeatedActionResult.Done causes the action to stop
        // returning RepeatedActionResult.Continue causes the action to continue invoking its action on an interval
        return i >= 100 ? RepeatedActionResult.Done : RepeatedActionResult.Continue;
    }
});

// invokes the action and starts the interval
// every ~100ms, 'action invoked' i 'foo' will be logged to the console...
repeated.invoke('foo');

// ... unless, the stop method is called before the action invocation returns RepeatedActionResult.Done, or...
repeated.stop();

// ... another invocation is called
repeated.invoke('bar');
```

- [Rng](https://github.com/CalionVarduk/ts-utils/blob/master/src/rng.ts#L2) - represents a pseudorandom number generator.

- [Semaphore](https://github.com/CalionVarduk/ts-utils/blob/master/src/semaphore.ts#L7) - represents a semaphore variable, that limits concurrent access to an asynchronous block of code. There also exists a [Mutex](https://github.com/CalionVarduk/ts-utils/blob/master/src/semaphore.ts#L72) class, that acts as a simple lock.

- [SkippableAction\<TArgs\>](https://github.com/CalionVarduk/ts-utils/blob/master/src/skippable-action.ts#L10) - represents an asynchronous action that skips all intermediate invocations.

An example:
```typescript
import { wait } from 'frl-ts-utils';

// creates a skippable action, that resolves after ~100ms
const skippable = new SkippableAction<string>(
    args => wait(100).then(() => console.log(args)));

// invokes the action and starts resolving it
skippable.invoke('foo');

// calling another invoke before the first invocation resolves causes the last invocation to be queued
// it will be invoked immediately after the first one resolves
skippable.invoke('bar');

// this call will cause the invoke('bar') call to be skipped
//  once the invoke('foo') finishes, the invoke('baz') will start resolving next
skippable.invoke('baz');

// current allows to fetch the promise, that is currently being resolved
// in this case, it will return the promise, that is a result of the invoke('foo') call
const promise = skippable.current();
```

- [StopWatch](https://github.com/CalionVarduk/ts-utils/blob/master/src/stopwatch.ts#L4) - represents a simple stopwatch object that allows to measure the passage of time. Its accurracy is somewhat limited, so unless you are ok with measurement errors of up to `~50ms`, then this is not a tool for you.

## E. [Events](https://github.com/CalionVarduk/ts-utils/blob/master/src/events)

Contains event publishing and event subscription functionality.

- [IEvent\<TArgs\>](https://github.com/CalionVarduk/ts-utils/blob/master/src/events/event.interface.ts#L33) - an interface representing a subscribable event.

- [IEventListener\<TArgs\>](https://github.com/CalionVarduk/ts-utils/blob/master/src/events/event.interface.ts#L14) - an interface representing an event subscription.

- [EventHandler\<TArgs\>](https://github.com/CalionVarduk/ts-utils/blob/master/src/events/event-handler.ts#L92) - an implementation of the `IEvent<TArgs>` interface. Additionally, allows to publish an event.

Examples:
```typescript
// creates a new event handler with no subscriptions
const handler = new EventHandler<string>();

// creates a new event subscription
handler.listen((sender, args) => console.log(sender, args));

// publishes an event with null sender and 'foo' argument
handler.publish(null, 'foo');

// disposing an event handler will automatically dispose all subscriptions
handler.dispose();
```

### Operators

Event listeners are decorable with operators. By calling the [decorate](https://github.com/CalionVarduk/ts-utils/blob/master/src/events/event.interface.ts#L29) method, you can specify how to modify the listener's behavior.

Built-in operators are:

- [debounce](https://github.com/CalionVarduk/ts-utils/blob/master/src/events/operators/debounce.ts#L10)

- [delay](https://github.com/CalionVarduk/ts-utils/blob/master/src/events/operators/delay.ts#L8)

- [filter](https://github.com/CalionVarduk/ts-utils/blob/master/src/events/operators/filter.ts#L9)

- [skipWhile](https://github.com/CalionVarduk/ts-utils/blob/master/src/events/operators/skip-while.ts#L9)

- [skip](https://github.com/CalionVarduk/ts-utils/blob/master/src/events/operators/skip.ts#L9)

- [takeWhile](https://github.com/CalionVarduk/ts-utils/blob/master/src/events/operators/take-while.ts#L10)

- [take](https://github.com/CalionVarduk/ts-utils/blob/master/src/events/operators/take.ts#L9)

Example of operator application:
```typescript
const handler = new EventHandler<string>();

// listen method returns a newly created event listener instance
const listener = handler.listen((sender, args) => console.log(sender, args));

// decorates the event listener with operators
// this particular decoration will cause the listener
// to skip first 3 event publications, and then
// only events with args being equal to either 'foo' or 'bar'
// will be sent further to the listener's delegate
listener.decorate(
    skip(3),
    filter((_, args) => ['foo', 'bar'].some(x => x === args));

// ignored by the listener, first skip
handler.publish(null, '1');

// ignored by the listener, second skip
handler.publish(null, '2');

// ignored by the listener, third skip
handler.publish(null, '3');

// caught by the listener
handler.publish(null, 'foo');

// ignored by the listener due to filtering operator
handler.publish(null, 'foobar');

// caught by the listener
handler.publish(null, 'bar');
```

It's also possible to define custom operators. The operator must be a function with the following signature:

```typescript
function yourOperatorName<TArgs>(/* your operator params */): EventListenerOperator<TArgs>;
```

[EventListenerOperator\<TArgs\>](https://github.com/CalionVarduk/ts-utils/blob/master/src/events/event.interface.ts#L6) is a type representing a delegate, that returns an event delegate. It accepts two parameters:

- `next` - a delegate, that calls the next operator, or the listener's delegate, if no other operators have been queued up.

- `listener` - a reference to the event's listener. Can be used e.g. to automatically dispose the listener from inside the operator, based on some condition.

Let's define a custom operator, that simply logs the published event's sender and args to the console, along with the provided title via the operator's parameter and the amount of operator invocations:
```typescript
function logToConsole<TArgs>(title: string): EventListenerOperator<TArgs>
{
    // listener parameter (the second one) is ignored in this case
    return next =>
    {
        // any operator state can be defined inside here
        // in this case, we will store the operator's invocation count
        let invocationCount = 0;

        // the operator's delegate definiton
        return (sender, args, event) =>
        {
            console.log(title);
            console.log('invocation count: ', ++invocationCount);
            console.log('sender: ', sender);
            console.log('args: ', args);

            // after performing our operator's actions (logging to the console)
            // we call the next delegate in the chain, with the same parameters
            next(sender, args, event);
        }
    };
}
```

And that's our operator! Let's apply it now to an event listener:
```typescript
handler.listen((sender, args) => console.log(sender, args))
    .decorate(logToConsole('hello event!'));
```

## F. [Logging](https://github.com/CalionVarduk/ts-utils/blob/master/src/logging)

Contains logging functionality.

- [LogMessage](https://github.com/CalionVarduk/ts-utils/blob/master/src/logging/log-message.ts#L5) - represents a logger message.

- [LogType](https://github.com/CalionVarduk/ts-utils/blob/master/src/logging/log-type.enum.ts#L2) - represents a logger message type.

- [ILogger](https://github.com/CalionVarduk/ts-utils/blob/master/src/logging/logger.interface.ts#L22) - an interface representing a subscribable logger.

- [ILoggerListener](https://github.com/CalionVarduk/ts-utils/blob/master/src/logging/logger.interface.ts#L10) - an interface representing a logger subscription.

- [Logger](https://github.com/CalionVarduk/ts-utils/blob/master/src/logging/logger.ts#L83) - an implementation of the `ILogger` interface.

Examples:
```typescript
// creates a new logger with no listeners
const logger = new Logger();

// creates a new logger listener
logger.listen((message, timestamp) =>
    console.log(`[${message.type}, ${timestamp}]: ${message}`));

// logs a message
// there are also a few more specialized methods, that log a message
logger.log(LogMessage.Information('foo'));

// it's also possible to set the logger's level
logger.logLevel = LogType.Warning;

// this message won't be logged due to the current logger's log level
// being set to Warning or above
logger.logInformation('bar');

// disposing a logger will automatically dispose all listeners
logger.dispose();
```

## G. [Mapping](https://github.com/CalionVarduk/ts-utils/blob/master/src/mapping)

Contains a simple object mapping functionality.

- [IMapper](https://github.com/CalionVarduk/ts-utils/blob/master/src/mapping/mapper.interface.ts#L10) - an interface representing an object mapper.

- [Mapper](https://github.com/CalionVarduk/ts-utils/blob/master/src/mapping/mapper.ts#L8) - an implementation of the `IMapper` interface. Additionall,y allows to add new mapping definitions.

Examples:
```typescript
class Foo
{
    public constructor(public value: number) {}
}

class Bar
{
    public constructor(public value: string) {}
}

// creates a new mapper without any mapping definitions
const mapper = new Mapper();

// registers mapping from number to string
mapper.add('number', 'string', x => x.toString());

// registers mapping from string to number
mapper.add('string', 'number', x =>
{
    const result = Number(x);
    return isNaN(result) ? 0 : result;
});

// registers mapping from Foo to Bar
mapper.add(Foo, Bar, (x, m) =>
{
    // m is a reference to the mapper instance
    // it can be used to recursively map other objects
    // from within the mapping definition function
    const value = m.map('string', x.value);
    return new Bar(value);
});

// returns '15'
const numberToStringResult = mapper.map('string', 15);

// returns 8
const stringToNumberResult = mapper.map('number', '8');

// returns new Bar instance with value equal to '11'
const fooToBarResult = mapper.map(Bar, new Foo(11));

// throws an error, since mapping from Bar to Foo is undefined
const barToFooResult = mapper.map(Foo, new Bar('1'));

// it's also possible to define mappings between primitive types and class types
// registers mapping from number to Foo
mapper.add('number', Foo, x => new Foo(x));

// registers mapping from Foo to number
mapper.add(Foo, 'number', x => x.value);

// returns new Foo instance with value equal to 7
const numberToFooResult = mapper.map(Foo, 7);

// returns 6
const fooToNumberResult = mapper.map('number', new Foo(6));
```

In addition to the `map` method, the `IMapper` contains some other helpful mapping methods: `mapNullable`, `mapUndefinable`, `mapOptional` and `mapRange`. The first 3 perform mapping conditionally, only when the source object is not `null`/`undefined` (depending on the used method). `mapRange` allows to map a collection of objects to another collection.

`mapRange` examples:
```typescript
// let's use the mapper from the previous example

const barCollection: Bar[] = [
    new Bar('1'),
    new Bar('2'),
    new Bar('3')
];

// returns an array with 3 new Foo instances
// first Foo instance value is equal to 1
// second Foo instance value is equal to 2
// third Foo instance value is equal to 3
const barToFooRangeResult = mapper.mapRange(Foo, barCollection);

// the source collection doesn't have to contain objects of the same type
// as long as all of its elements are mappable to the destination type
// if at least one element is not mappable, then the mapRange method will throw
const mixedCollection = [
    new Bar('4'),
    5,
    new Bar('6')
];

// returns an array with 3 new Foo instances
// first Foo instance value is equal to 4
// second Foo instance value is equal to 5
// third Foo instance value is equal to 6
const mixedToFooRangeResult = mapper.mapRange(Foo, mixedCollection);
```

## H. [Tasks](https://github.com/CalionVarduk/ts-utils/blob/master/src/tasks)

Contains an asychronous, cancellable task functionality.

- [ITask\<T\>](https://github.com/CalionVarduk/ts-utils/blob/master/src/tasks/task.interface.ts#L6) - an interface representing an executable task.

- [TaskResult\<T\>](https://github.com/CalionVarduk/ts-utils/blob/master/src/tasks/task-result.ts#L4) - represents the task's result.

- [TaskState](https://github.com/CalionVarduk/ts-utils/blob/master/src/tasks/task-state.enum.ts#L2) - represents the task's current state.

- [TaskContinuationStrategy](https://github.com/CalionVarduk/ts-utils/blob/master/src/tasks/task-continuation-strategy.enum.ts#L2) - represents the task's continuation strategy. Used as an [ITask.then](https://github.com/CalionVarduk/ts-utils/blob/master/src/tasks/task.interface.ts#L26) method's parameter.

- [Task\<T\>](https://github.com/CalionVarduk/ts-utils/blob/master/src/tasks/task.ts#L172) - an implementation of the `ITask<T>` interface.

Examples:
```typescript
// creates a new promise-based task instance
// in Created state
const task = new Task<string>(() => Promise.resolve('foo'));

// alternatively:
// task = Task.FromResult('foo');

// executes the task, which changes its state to Running
// returns the task's result of type TaskResult<string>
const result = await task.execute();

// since the task executed without any errors,
// it will be in the Completed state

// value will be equal to 'foo'
const value = result.value;

// create a task, that throws an error during its execution
const errorTask = new Task<string>(() => Promise.reject(new Error()));

// alternatively:
// task = Task.FromError<string>(new Error());

// since the task throws an error,
// its state will be changed to Faulted
const result = await task.execute();

// error will be equal to the Error instance provided
// to the Promise.reject function
const error = result.error;
```

There exists a static instance of a completed task, which can be useful in certain situations:
```typescript
const completedTask = Task.COMPLETED;
```

Tasks can also be cancelled by dedicated cancellation tokens, like so:
```typescript
// creates a new cancellation token, that isn't cancelled yet
const cancellationToken = new TaskCancellationToken();

const task = new Task<string>(async () =>
{
    // simulate a long-running task
    for (let i = 0; i < 100; ++i)
    {
        // checks if the cancellation token has been cancelled
        // and, in that case, throws an error
        cancellationToken.throwIfCancellationRequested();
        await wait(100);
    }
    return 'foo';
});

// cancels the token with an optional reason
cancellationToken.cancel('cancellation reason');

// since the task is cancelled via a token,
// its state will be changed to Cancelled
const result = await task.execute();

// error will be of type TaskCancellationError
const error = result.error;

// it's also possible to cancel the token after a specified amount of time (in ms)
cancellationToken.cancelAfter(1000);
```

Another important functionality of `ITask<T>` is the possibility to continue it with another task. This can be achieved by calling the [ITask.then](https://github.com/CalionVarduk/ts-utils/blob/master/src/tasks/task.interface.ts#L26) method, like so:
```typescript
// first task
const task = Task.FromResult('foo');

// continuation task
// the result parameter represents the first task's result
// which can be used to create the follow-up task
const continuationTask = task.then(result =>
    Task.FromResult([result.value, 'bar']));

const fullResult = await continuationTask.execute();

// value will be an array of strings, containing two elements: 'foo' and 'bar'
const value = fullResult.value;
```

[ITask.then](https://github.com/CalionVarduk/ts-utils/blob/master/src/tasks/task.interface.ts#L26) method has an optional second parameter of type [TaskContinuationStrategy](https://github.com/CalionVarduk/ts-utils/blob/master/src/tasks/task-continuation-strategy.enum.ts#L2). It specifies, in which scenarios to continue the first task, based on its state. By default, all task states are continued.

If a continuation task is not invoked due to the continuation strategy, then its state will be changed to `Discontinued`.

Another useful `ITask` methods are:
- `join` - runs mutliple tasks concurrently and returns a new task, that resolves after all tasks have been resolved (such a joined task can also be created by calling the `Task.All` function).
- `race` - runs multiple tasks concurrently and returns a new task, that resolves after any task has been resolved (such a race task can also be created by calling the `Task.Any` function).
- `map` - allows to map task's result to another type. It will only be executed for task's, that complete successfuly.

## I. [Collections](https://github.com/CalionVarduk/ts-utils/blob/master/src/collections)

Contains a few useful collections and data structures, as well as some collection manipulation algorithms.

- [Enumerable\<T\>](https://github.com/CalionVarduk/ts-utils/blob/master/src/collections/enumerable.ts#L23) - represents an enumerable collection, which can be manipulated via its methods.

- [Heap\<T\>](https://github.com/CalionVarduk/ts-utils/blob/master/src/collections/heap.ts#L65) - represents a heap data structure.

- [Iteration](https://github.com/CalionVarduk/ts-utils/blob/master/src/collections/iteration.ts#L43) - contains a few algorithms that allow to manipulate collections.

- [KeyedCollection\<TKey, TEntity\>](https://github.com/CalionVarduk/ts-utils/blob/master/src/collections/keyed-collection.ts#L47) - represents a keyed collections of entities.

- [List\<T\>](https://github.com/CalionVarduk/ts-utils/blob/master/src/collections/list.ts#L80) - represents a linked list data structure.

- [Pair\<T, U\>](https://github.com/CalionVarduk/ts-utils/blob/master/src/collections/pair.ts#L2) - represents a pair of objects.

- [Queue\<T\>](https://github.com/CalionVarduk/ts-utils/blob/master/src/collections/queue.ts#L20) - represents a queue data structure.

- [Stack\<T\>](https://github.com/CalionVarduk/ts-utils/blob/master/src/collections/stack.ts#L5) - represents a stack data structure.

- [UnorderedMap\<TKey, TEntity\>](https://github.com/CalionVarduk/ts-utils/blob/master/src/collections/unordered-map.ts#L12) - represents an unordered map data structure.

- [UnorderedSet\<T\>](https://github.com/CalionVarduk/ts-utils/blob/master/src/collections/unordered-set.ts#L8) - represents an unordered set data structure.
