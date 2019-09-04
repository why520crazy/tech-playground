// // identity函数。 这个函数会返回任何传入它的值
// function identity(arg: number): number {
//     return arg;
// }




// // 1. 使用重载
// function identity(arg: object): object;
// function identity(arg: string): string;
// function identity(arg: number): number;
// function identity(arg: any): any {
//     return arg;
// }

// const result1 = identity(1);
// const result2 = identity('xxx');



// // 2. 使用 Any 类型
// function identity(arg: any): any {
//     return arg;
// }


// // 3. 使用泛型
// function identity<T>(arg: T): T {
//     return arg;
// }
// const output1 = identity<number>(100);
// const output2 = identity<string>('myString');
// const output3 = identity<{ name: string }>({ name: 'myName' });
// // type inference 类型推论使代码精简和高可读性
// const output4 = identity(100);
// const output5 = identity('myString');
