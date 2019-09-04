// // interface PersonPartial {
// //     name?: string;
// //     age?: number;
// // }

// // interface PersonReadonly {
// //     readonly name: string;
// //     readonly age: number;
// // }

// interface Person {
//     name: string;
//     age: number;
// }

// type MyReadonly<T> = {
//     readonly [P in keyof T]: T[P];
// };
// type MyPartial<T> = {
//     [P in keyof T]?: T[P];
// };

// type PersonPartial = MyPartial<Person>;
// type ReadonlyPerson = MyReadonly<Person>;

// type NullablePerson = { [P in keyof Person]: Person[P] | null };
// type PartialPerson = { [P in keyof Person]?: Person[P] };

// type Proxy<T> = {
//     get(): T;
//     set(value: T): void;
// };
// type Proxify<T> = {
//     [P in keyof T]: Proxy<T[P]>;
// };
// function proxify<T>(o: T): Proxify<T> {
//     return null;
// }
// let proxyProps = proxify({ name: 'name', description: 'desc' });
// // type TProxyProps = typeof proxyProps;

// // 由映射类型进行推断
// function unproxify<T>(t: Proxify<T>): T {
//     let result = {} as T;
//     for (const k in t) {
//         result[k] = t[k].get();
//     }
//     return result;
// }
// let originalProps = unproxify(proxyProps);
