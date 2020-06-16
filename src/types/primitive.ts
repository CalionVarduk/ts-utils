/** Primitive type alias. */
export type Primitive = string | number | boolean;

/** Defines primitive types. */
export type PrimitiveTypesMap =
{
    string: string;
    number: number;
    boolean: boolean;
    symbol: symbol;
    function: Function;
    object: Object;
    undefined: undefined;
};

/** Defines primitive type names. */
export type PrimitiveTypeNames = keyof PrimitiveTypesMap;
