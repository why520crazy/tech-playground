
// type Diff<T, U> = T extends U ? never : T; // Remove types from T that are assignable to U
// type Filter<T, U> = T extends U ? T : never; // Remove types from T that are not assignable to U

// type T30 = Diff<'a' | 'b' | 'c' | 'd', 'a' | 'c' | 'f'>; // "b" | "d"
// type T31 = Filter<'a' | 'b' | 'c' | 'd', 'a' | 'c' | 'f'>; // "a" | "c"
// type T32 = Diff<string | number | (() => void), Function>; // string | number
// type T33 = Filter<string | number | (() => void), Function>; // () => void

// type MyNonNullable<T> = Diff<T, null | undefined>; // Remove null and undefined from T

// type T34 = NonNullable<string | number | undefined>; // string | number
// type T35 = NonNullable<string | string[] | null | undefined>; // string | string[]

// function f1<T>(x: T, y: NonNullable<T>) {
//     x = y; // Ok
//     y = x; // Error
// }

// function f2<T extends string | undefined>(x: T, y: MyNonNullable<T>) {
//     x = y; // Ok
//     y = x; // Error
//     let s1: string = x; // Error
//     let s2: string = y; // Ok
// }

// type FunctionPropertyNames<T> = { [K in keyof T]: T[K] extends Function ? K : never }[keyof T];
// type FunctionProperties<T> = Pick<T, FunctionPropertyNames<T>>;

// type NonFunctionPropertyNames<T> = { [K in keyof T]: T[K] extends Function ? never : K }[keyof T];
// type NonFunctionProperties<T> = Pick<T, NonFunctionPropertyNames<T>>;

// interface Part {
//     id: number;
//     name: string;
//     subparts: Part[];
//     updatePart(newName: string): void;
// }

// type T40 = FunctionPropertyNames<Part>;  // "updatePart"
// type T41 = NonFunctionPropertyNames<Part>;  // "id" | "name" | "subparts"
// type T42 = FunctionProperties<Part>;  // { updatePart(newName: string): void }
// type T43 = NonFunctionProperties<Part>;  // { id: number, name: string, subparts: Part[] }
