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

- [DeepReadonly\<T\>](https://github.com/CalionVarduk/ts-utils/blob/master/src/types/deep-readonly.ts#L2) - represents a deep readonly `T` type.

- [IDeepReadonlyArray\<T\>](https://github.com/CalionVarduk/ts-utils/blob/master/src/types/deep-readonly.ts#L14) - an interface that extends the `ReadonlyArray<DeepReadonly<T>>` interface.

- [IDeepReadonlyMap\<K, V\>](https://github.com/CalionVarduk/ts-utils/blob/master/src/types/deep-readonly.ts#L17) - an interface that extends the `ReadonlyMap<DeepReadonly<K>, DeepReadonly<V>>` interface.

- [IDeepReadonlySet\<T\>](https://github.com/CalionVarduk/ts-utils/blob/master/src/types/deep-readonly.ts#L20) - an interface that extends the `ReadonlySet<DeepReadonly<T>>` interface.

- [EmptyObject](https://github.com/CalionVarduk/ts-utils/blob/master/src/types/empty-object.ts) - represents an empty object type - `{}`.

- [Ensured\<T\>](https://github.com/CalionVarduk/ts-utils/blob/master/src/types/ensured.ts) - removes `null | undefined` types from `T` type.

- [KeyOfType\<TType, TPropertyType\>](https://github.com/CalionVarduk/ts-utils/blob/master/src/types/key-of.ts#L7) - represents names of `TType` members that are of `TPropertyType` type.

- [MethodKeyOf\<TType\>](https://github.com/CalionVarduk/ts-utils/blob/master/src/types/key-of.ts#L18) - represents names of `TType` members that are of `Function` type.

- [PropertyKeyOf\<TType\>](https://github.com/CalionVarduk/ts-utils/blob/master/src/types/key-of.ts#L24) - represents names of `TType` members that are not of `Function` type.

- [RequiredKeyOf\<TType\>](https://github.com/CalionVarduk/ts-utils/blob/master/src/types/key-of.ts#L30) - represents names of `TType` members that are not nullable and not undefinable.

- [OptionalKeyOf\<TType\>](https://github.com/CalionVarduk/ts-utils/blob/master/src/types/key-of.ts#L41) - represents names of `TType` members that are nullable and/or undefinable.

- [RequiredKeyOfType\<TType, TPropertyType\>](https://github.com/CalionVarduk/ts-utils/blob/master/src/types/key-of.ts#L47) - represents names of `TType` members that are not nullable and not undefinable, and that are of `TPropertyType` type.

- [OptionalKeyOfType\<TType, TPropertyType\>](https://github.com/CalionVarduk/ts-utils/blob/master/src/types/key-of.ts#L58) - represents names of `TType` members that are nullable and/or undefinable, and that are of `TPropertyType` type.

- [MemberKey](https://github.com/CalionVarduk/ts-utils/blob/master/src/types/member-key.ts) - represents a union type of `string`, `number` and `symbol`.

- [None](https://github.com/CalionVarduk/ts-utils/blob/master/src/types/none.ts) - represents a union type of `null` and `undefined`.

- [Nullable\<T\>](https://github.com/CalionVarduk/ts-utils/blob/master/src/types/nullable.ts) - represents a union type of `T` and `null`.

- [ObjectType\<T\>](https://github.com/CalionVarduk/ts-utils/blob/master/src/types/object-type.ts) - represents a constructor of type `T`.

- [Optional\<T\>](https://github.com/CalionVarduk/ts-utils/blob/master/src/types/optional.ts) - represents a union type of `T`, `null` and `undefined`.

- [Primitive](https://github.com/CalionVarduk/ts-utils/blob/master/src/types/primitive.ts#L2) - represents a union type of `string`, `number` and `boolean`.

- [PrimitiveTypesMap](https://github.com/CalionVarduk/ts-utils/blob/master/src/types/primitive.ts#L5) - represents a name-to-type map for primitive types.

- [PrimitiveTypeNames](https://github.com/CalionVarduk/ts-utils/blob/master/src/types/primitive.ts#L17) - represents a union of primitive type names.

- [Ref\<T\>](https://github.com/CalionVarduk/ts-utils/blob/master/src/types/ref.ts#L2) - represents a reference type for value type `T`.

- [Undefinable\<T\>](https://github.com/CalionVarduk/ts-utils/blob/master/src/types/undefinable.ts) - represents a union type of `T` and `undefined`.

## C. Functions

- [makeRef\<T\>](https://github.com/CalionVarduk/ts-utils/blob/master/src/types/ref.ts#L12) - creates a new `Ref<T>` object with the provided value.

- [Assert](https://github.com/CalionVarduk/ts-utils/blob/master/src/functions/assert.ts#L21) - a namespace containing a few useful assertion functions. These assertion functions either pass and return the provided parameter (except for [Assert.True](https://github.com/CalionVarduk/ts-utils/blob/master/src/functions/assert.ts#L166) and [Assert.False](https://github.com/CalionVarduk/ts-utils/blob/master/src/functions/assert.ts#L178) functions) or throw an `Error`.

- [deepFreeze\<T\>](https://github.com/CalionVarduk/ts-utils/blob/master/src/functions/deep-freeze.ts) - recursively deep freezes the provided object and its properties, and returns it as `DeepReadonly<T>`.

- [dynamicCast\<T\>](https://github.com/CalionVarduk/ts-utils/blob/master/src/functions/dynamic-cast.ts#L21) - allows to safely cast an object to the specified type, otherwise returns `null`. Works for object and primitive types.

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

- [isOfType\<T\>](https://github.com/CalionVarduk/ts-utils/blob/master/src/functions/dynamic-cast.ts#L37) - allows to check, if an object is of specified type. Works for object and primitive types. This is very similar to the `dynamicCast<T>` function, however, instead of returning a cast object or `null`, it returns `true` or `false` instead, respectively.

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

- [isDefined\<T\>](https://github.com/CalionVarduk/ts-utils/blob/master/src/functions/is-defined.ts) - returns `true`, if an object is not `null` and not `undefined`, otherwise returns `false`.

- [isNull\<T\>](https://github.com/CalionVarduk/ts-utils/blob/master/src/functions/is-null.ts) - returns `true`, if an object is `null`, otherwise returns `false`.

- [isUndefined\<T\>](https://github.com/CalionVarduk/ts-utils/blob/master/src/functions/is-undefined.ts) - returns `true`, if an object is `undefined`, otherwise returns `false`.

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

- [reinterpretCast\<T\>](https://github.com/CalionVarduk/ts-utils/blob/master/src/functions/reinterpret-cast.ts) - allows to force cast an object to the specified type.
<br/>**Be very careful while using this function, because it allows you to cast any object to any type, which may cause the compilation process not to catch an obvious error.**

An example:
```typescript
class Bar {}

const bar = new Bar();
// this is a valid usage, however unfortunate it may be
const result = reinterpretCast<string>(bar);
result.trim(); // runtime error, instead of a compilation error
```

- [wait](https://github.com/CalionVarduk/ts-utils/blob/master/src/functions/wait.ts) - creates a promise that resolves after the specified amount of time (in milliseconds).

## D. Classes

- [DeferredAction\<TArgs\>](https://github.com/CalionVarduk/ts-utils/blob/master/src/deferred-action.ts) - represents an action that should be invoked after a specified amount of time has passed. This class allows e.g. to create a simple debouncing mechanism, since every new invocation request resets the timer.

- [EventHandler\<TEvent, TArgs\>](https://github.com/CalionVarduk/ts-utils/blob/master/src/event.ts#L39) - represents a simple event handler, that allows for event publishing and event subscription. An [IEvent\<TEvent, TArgs\>](https://github.com/CalionVarduk/ts-utils/blob/master/src/event.ts#L5) interface can be used to encapsulate the handler and allow your class consumers to only subscribe to the event, removing the option to publish it as well.

- [Flag\<T\>](https://github.com/CalionVarduk/ts-utils/blob/master/src/flag.ts) - represents a simple flag or switch object, whose value can be changed.

- [Lazy\<T\>](https://github.com/CalionVarduk/ts-utils/blob/master/src/lazy.ts) - represents a lazily initialized object.

- [Mixin\<T\>](https://github.com/CalionVarduk/ts-utils/blob/master/src/mixin.ts) - represents a mixin object that can be merged together with other objects.

- [RepeatedAction\<TArgs\>](https://github.com/CalionVarduk/ts-utils/blob/master/src/repeated-action.ts) - represents a stoppable action that is continuously invoked at a specified interval. This class allows e.g. to create a simple polling mechanism, that stops after a desired result has been achieved.

- [StopWatch](https://github.com/CalionVarduk/ts-utils/blob/master/src/stopwatch.ts) - represents a simple stopwatch object that allows to measure the passage of time. Its accurracy is somewhat limited, so unless you are ok with measurement errors of up to `~50ms`, then this is not a tool for you.
