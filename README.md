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

- [Optional\<T\>](https://github.com/CalionVarduk/ts-utils/blob/master/src/types/optional.ts#L5) - represents a union type of `T`, `null` and `undefined`.

- [Primitive](https://github.com/CalionVarduk/ts-utils/blob/master/src/types/primitive.ts#L2) - represents a union type of `string`, `number` and `boolean`.

- [PrimitiveTypesMap](https://github.com/CalionVarduk/ts-utils/blob/master/src/types/primitive.ts#L5) - represents a name-to-type map for primitive types.

- [PrimitiveTypeNames](https://github.com/CalionVarduk/ts-utils/blob/master/src/types/primitive.ts#L17) - represents a union of primitive type names.

- [Ref\<T\>](https://github.com/CalionVarduk/ts-utils/blob/master/src/types/ref.ts#L2) - represents a reference type for value type `T`.

- [Stringifier\<T\>](https://github.com/CalionVarduk/ts-utils/blob/master/src/types/stringifier.ts#L2) - represents a delegate that converts an object of type `T` to `string`.

- [TypeInstance\<TType\>](https://github.com/CalionVarduk/ts-utils/blob/master/src/types/type-instance.ts#L2) - represents an instance type of either an `ObjectType<T>` or `PrimitiveTypeNames` type.

- [Undefinable\<T\>](https://github.com/CalionVarduk/ts-utils/blob/master/src/types/undefinable.ts#L2) - represents a union type of `T` and `undefined`.

## C. Functions

- [makeRef\<T\>](https://github.com/CalionVarduk/ts-utils/blob/master/src/types/ref.ts#L13) - creates a new `Ref<T>` object with the provided value.

- [toDeepReadonly\<T\>](https://github.com/CalionVarduk/ts-utils/blob/master/src/types/deep-readonly.ts#L31) - casts an object of type `T` to type `DeepReadonly<T>`.

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

- [DeferredAction\<TArgs\>](https://github.com/CalionVarduk/ts-utils/blob/master/src/deferred-action.ts#L15) - represents an action that should be invoked after a specified amount of time has passed. This class allows e.g. to create a simple debouncing mechanism, since every new invocation request resets the timer.

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

- [IDisposable](https://github.com/CalionVarduk/ts-utils/blob/master/src/disposable.interface.ts#L2) - represents a disposable object.

- [EventHandler\<TEvent, TArgs\>](https://github.com/CalionVarduk/ts-utils/blob/master/src/event.ts#L39) - represents a simple event handler, that allows for event publishing and event subscription. An [IEvent\<TEvent, TArgs\>](https://github.com/CalionVarduk/ts-utils/blob/master/src/event.ts#L5) interface can be used to encapsulate the handler and allow your class consumers to only subscribe to the event, removing the option to publish it as well.

- [Flag\<T\>](https://github.com/CalionVarduk/ts-utils/blob/master/src/flag.ts#L2) - represents a simple flag or switch object, whose value can be changed.

An example:
```typescript
// creates a boolean flag with initial value set to false
const flag = new Flag<boolean>(false);

// update method allows to change the flag's value
flag.update(true);

// exchange also changes the flag's value, however, it also returns the old value - here, the old variable will be equal to true
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

- [RepeatedAction\<TArgs\>](https://github.com/CalionVarduk/ts-utils/blob/master/src/repeated-action.ts#L24) - represents a stoppable action that is continuously invoked at a specified interval. This class allows e.g. to create a simple polling mechanism, that stops after a desired result has been achieved.

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

- [Semaphore](https://github.com/CalionVarduk/ts-utils/blob/master/src/rng.ts#L7) - represents a semaphore variable, that limits concurrent access to an asynchronous block of code. There also exists a [Mutex](https://github.com/CalionVarduk/ts-utils/blob/master/src/rng.ts#L72) class, that acts as a simple lock.

- [SkippableAction\<TArgs\>](https://github.com/CalionVarduk/ts-utils/blob/master/src/skippable-action.ts#L10) - represents an asynchronous action that skips all intermediate invocations.

An example:
```typescript
import { wait } from 'frl-ts-utils';

// creates a skippable action, that resolves after ~100ms
const skippable = new SkippableAction<string>(
    args => wait(100).then(() => console.log(args)));

// invokes the action and starts resolving it
skippable.invoke('foo');

// calling another invoke before the first invocation resolves causes the last invocation to be queued - it will be invoked immediately after the first one resolves
skippable.invoke('bar');

// this call will cause the invoke('bar') call to be skipped - once the invoke('foo') finishes, the invoke('baz') will start resolving next
skippable.invoke('baz');

// current allows to fetch the promise, that is currently being resolved
// in this case, it will return the promise, that is a result of the invoke('foo') call
const promise = skippable.current();
```

- [StopWatch](https://github.com/CalionVarduk/ts-utils/blob/master/src/stopwatch.ts#L4) - represents a simple stopwatch object that allows to measure the passage of time. Its accurracy is somewhat limited, so unless you are ok with measurement errors of up to `~50ms`, then this is not a tool for you.

## E. [Events](https://github.com/CalionVarduk/ts-utils/blob/master/src/events)

- TODO

## F. [Logging](https://github.com/CalionVarduk/ts-utils/blob/master/src/logging)

- TODO

## G. [Mapping](https://github.com/CalionVarduk/ts-utils/blob/master/src/mapping)

- TODO

## H. [Tasks](https://github.com/CalionVarduk/ts-utils/blob/master/src/tasks)

- TODO

## I. [Collections](https://github.com/CalionVarduk/ts-utils/blob/master/src/collections)

- TODO
