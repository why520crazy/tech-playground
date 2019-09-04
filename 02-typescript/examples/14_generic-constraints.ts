// interface Lengthwise {
//     length: number;
// }

// function loggingIdentity<T extends Lengthwise>(arg: T): T {
//     console.log(arg.length); // Now we know it has a .length property, so no more error
//     return arg;
// }
// loggingIdentity(3); // Error, number doesn't have a .length property
// loggingIdentity({ length: 10, value: 3 });


// // 在泛型约束中使用类型参数
// function getProperty<T, K extends keyof T>(obj: T, key: K) {
//     return obj[key];
// }

// let x = { a: 1, b: 2, c: 3, d: 4 };

// getProperty(x, "a"); // okay
// getProperty(x, "m"); // error: Argument of type 'm' isn't assignable to 'a' | 'b' | 'c' | 'd'.

// // 在泛型里使用类类型
// function create<T>(c: {new(): T; }): T {
//     return new c();
// }


// class BeeKeeper {
//     hasMask: boolean;
// }

// class ZooKeeper {
//     nameTag: string;
// }

// class Animal {
//     numLegs: number;
// }

// class Bee extends Animal {
//     keeper: BeeKeeper;
// }

// class Lion extends Animal {
//     keeper: ZooKeeper;
// }

// function createInstance<A extends Animal>(c: new () => A): A {
//     return new c();
// }

// createInstance(Lion).keeper.nameTag;  // typechecks!
// createInstance(Bee).keeper.hasMask;   // typechecks!
