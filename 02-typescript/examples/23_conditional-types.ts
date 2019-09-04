// declare function f<T extends boolean>(x: T): T extends true ? string : number;

// // Type is 'string | number
// let x = f(Math.random() < 0.5);
// let x1: string = f(true);
// let x2: number = f(false);

// // TypeName
// type TypeName<T> = T extends string
//     ? 'string'
//     : T extends number
//     ? 'number'
//     : T extends boolean
//     ? 'boolean'
//     : T extends undefined
//     ? 'undefined'
//     : T extends Function
//     ? 'function'
//     : 'object';

// type T0 = TypeName<string>; // "string"
// type T1 = TypeName<'a'>; // "string"
// type T2 = TypeName<true>; // "boolean"
// type T3 = TypeName<() => void>; // "function"
// type T4 = TypeName<string[]>; // "object"

// // Distributive conditional types
// type T10 = TypeName<string | (() => void)>; // "string" | "function"
// type T12 = TypeName<string | string[] | undefined>; // "string" | "object" | "undefined"
// type T11 = TypeName<string[] | number[]>; // "object"
