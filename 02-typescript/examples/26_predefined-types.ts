// Required
type Required01 = Required<{ name?: string; desc?: string; id: number }>;

// Partial
type Partial01 = Partial<{ name: string; desc?: string; id: number }>;

//Readonly
type Readonly01 = Readonly<{ name: string; desc?: string; id: number }>;

// Pick
type Pick01 = Pick<{ name?: string; desc?: string; id: number }, 'id'>;
type Pick02 = Pick<{ name?: string; desc?: string; id: number }, 'id' | 'name'>;

// Record
type Record01 = Record<'user', { name?: string; desc?: string; id: number }>;
type Record02 = Record<'user' | 'created_by', { name?: string; desc?: string; id: number }>;

// Exclude
type Exclude01 = Exclude<'a' | 'b' | 'c' | 'd', 'a' | 'c' | 'f'>; // "b" | "d"
type Exclude02<T, U> = Exclude<keyof T, keyof U>;
type Exclude03 = Exclude02<{ name?: string; desc?: string; id: number }, { name: string }>;
type Exclude04 = Exclude<string | number | (() => void), Function>; // string | number

// Extract
type Extract01 = Extract<'a' | 'b' | 'c' | 'd', 'a' | 'c' | 'f'>; // "a" | "c"
type Extract02<T, U> = Extract<keyof T, keyof U>;
type Extract03 = Extract02<{ name?: string; desc?: string; id: number }, { name: string }>;
type Extract04 = Extract<string | number | (() => void), Function>; // () => void

// NonNullable
type NonNullable01 = NonNullable<string | number | undefined>; // string | number
type NonNullable02 = NonNullable<(() => string) | string[] | null | undefined>; // (() => string) | string[]

// Omit 删除，忽略某个属性
type Omit01 = Omit<{ name?: string; desc?: string; id: number }, 'id'>;
type Omit02 = Omit<{ name?: string; desc?: string; id: number }, 'id1'>;

// MyOmit
type MyOmit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
type Omit03 = MyOmit<{ name?: string; desc?: string; id: number }, 'id' | 'name'>;

// ReturnType
type T10 = ReturnType<() => string>; // string
type T11 = ReturnType<(s: string) => void>; // void
type T12 = ReturnType<<T>() => T>; // {}
type T13 = ReturnType<<T extends U, U extends number[]>() => T>; // number[]
type T14 = ReturnType<typeof f1>; // { a: number, b: string }
type T15 = ReturnType<any>; // any
type T16 = ReturnType<never>; // never
type T17 = ReturnType<string>; // Error
type T18 = ReturnType<Function>; // Error

// InstanceType
class C {
    x = 0;
    y = 0;
    constructor(id: number, name: string) {}
}

type T20 = InstanceType<typeof C>; // C
type T21 = InstanceType<any>; // any
type T22 = InstanceType<never>; // never

type T23 = InstanceType<string>; // Error
type T24 = InstanceType<Function>; // Error
type T25 = InstanceType<{ name: string }>; // Error

// Parameters
type Parameters01 = Parameters<(id: number, name: string) => void>; // [number, string]
type Parameters02 = Parameters<(id: number, name: string) => number>; // [number, string]
type Parameters03 = Parameters<() => number>; // []

// ConstructorParameters
type ConstructorParameters01 = ConstructorParameters<typeof C>; // [number, string]

// ThisType
type ThisType01 = ThisType<C>;
type ThisType02 = ThisType<{name:string}>;

