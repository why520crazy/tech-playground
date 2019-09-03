// interface StringArray {
//     [index: number]: string;
// }

// let myArray: StringArray;
// myArray = ['Bob', 'Fred'];

// let myStr: string = myArray[0];

// class Animal {
//     name: string;
// }
// class Dog extends Animal {
//     breed: string;
// }

// interface NotOkay {
//     [x: number]: Animal; // 数字索引类型“Animal”不能赋给字符串索引类型“Dog”。
//     [x: string]: Dog;
// }

// interface NumberDictionary {
//     [index: string]: number;
//     length: number; // 可以，length是number类型
//     name: string; // 错误，类型“string”的属性“name”不能赋给字符串索引类型“number”。
// }

// interface ReadonlyStringArray {
//     readonly [index: number]: string;
// }
// let myArray: ReadonlyStringArray = ['Alice', 'Bob'];
// myArray[2] = 'Mallory'; // error!
