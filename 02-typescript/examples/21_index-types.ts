// // function pluck(o, propertyNames) {
// //     return propertyNames.map(n => o[n]);
// // }

// function pluck<T, K extends keyof T>(o: T, names: K[]): T[K][] {
//     return names.map(n => o[n]);
// }

// interface Person {
//     name: string;
//     age: number;
// }
// let person: Person = {
//     name: 'Jarid',
//     age: 35
// };
// let strings: string[] = pluck(person, ['name']); // ok, string[]





// function getProperty<T, K extends keyof T>(o: T, name: K): T[K] {
//     return o[name]; // o[name] is of type T[K]
// }

// let personName: string = getProperty(person, 'name');
// let personAge: number = getProperty(person, 'age');
// let unknown = getProperty(person, 'unknown'); // error, 'unknown' is not in 'name' | 'age'


// interface Dictionary<T> {
//     [key: string]: T;
// }
// let keys: keyof Dictionary<number>; // string | number
// let value: Dictionary<number>['foo']; // number
