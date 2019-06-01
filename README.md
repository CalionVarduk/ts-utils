# TS utils

[![Build Status](https://travis-ci.com/CalionVarduk/ts-utils.png?branch=master)](https://travis-ci.com/CalionVarduk/ts-utils)
[![Coverage Status](https://coveralls.io/repos/github/CalionVarduk/ts-utils/badge.svg)](https://coveralls.io/github/CalionVarduk/ts-utils)
[![npm version](https://badge.fury.io/js/frlluc-utils.svg)](https://www.npmjs.com/package/frlluc-utils)
[![Dependency status](https://david-dm.org/CalionVarduk/ts-utils/status.svg)](https://david-dm.org/CalionVarduk/ts-utils)
[![Dev Dependency Status](https://david-dm.org/CalionVarduk/ts-utils/dev-status.svg)](https://david-dm.org/CalionVarduk/ts-utils?type=dev)
[![License](https://img.shields.io/github/license/mashape/apistatus.svg)](https://github.com/CalionVarduk/ts-utils/blob/master/LICENSE)

This little project contains a few quality-of-life utils.

## A. Installation

If you are using `npm`, then simply run the `npm install frlluc-utils` CLI command to get the latest version.

If you are using `yarn`, then go with the `yarn add frlluc-utils` command.

## B. Types

There are a few util types and interfaces:

- [Optional\<T\>](https://github.com/CalionVarduk/ts-utils/blob/master/src/core/optional.ts) - represents a union type of `T` and `undefined`.

- [Nullable\<T\>](https://github.com/CalionVarduk/ts-utils/blob/master/src/core/nullable.ts) - represents a union type of `T` and `null`.

- [Const\<T\>](https://github.com/CalionVarduk/ts-utils/blob/master/src/core/const.ts#L2) - represents a deep readonly `T` type.

- [IConstArray\<T\>](https://github.com/CalionVarduk/ts-utils/blob/master/src/core/const.ts#L13) - an interface that extends the `ReadonlyArray<Const<T>>` interface.

- [IConstMap\<K, V\>](https://github.com/CalionVarduk/ts-utils/blob/master/src/core/const.ts#L15) - an interface that extends the `ReadonlyMap<Const<K>, Const<V>>` interface.

- [IConstSet\<T\>](https://github.com/CalionVarduk/ts-utils/blob/master/src/core/const.ts#L17) - an interface that extends the `ReadonlySet<Const<T>>` interface.

## C. Functions

Let's assume we have two classes, `Foo` and `Bar`, where `Bar extends Foo`.

There are two util functions:

- [reinterpretCast\<T\>](https://github.com/CalionVarduk/ts-utils/blob/master/src/core/reinterpret-cast.ts) - allows to force cast an object to the specified type.<br/>**Be very careful with this function, because you can do stuff like this:**

```typescript
const bar = new Bar();
// yep, this works!
const result = reinterpretCast<string>(bar);
```

- [dynamicCast\<T\>](https://github.com/CalionVarduk/ts-utils/blob/master/src/core/dynamic-cast.ts) - allows to safely cast an object to the specified type of which it is an `instanceof`, otherwise returns `null`.

```typescript
const bar = new Bar();
// returns bar as a Foo object
const foo = dynamicCast(Foo, bar);
// returns null
const str = dynamicCast(String, bar);
```
