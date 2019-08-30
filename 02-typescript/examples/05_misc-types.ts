// // Null Or Undefined
// let aUndefined: undefined = undefined; // Oky
// aUndefined = null; // Oky
// aUndefined = 1; // Error

// let aNull: null = null; // Oky
// aNull = undefined; // Oky
// aNull = 1; // Error

// // Any
// let notSure: any = 4;
// notSure.ifItExists(); // okay, ifItExists might exist at runtime
// notSure.toFixed(); // okay, toFixed exists (but the compiler doesn't check)

// let prettySure: object = 4;
// prettySure.toFixed(); // Error: Property 'toFixed' doesn't exist on type 'Object'.

// // Void
// function warnUser(): void {
//     console.log('This is my warning message');
// }
// let unusable: void = undefined;

// // Never
// // 返回 never 的函数必须存在无法达到的终点
// function error(message: string): never {
//     throw new Error(message);
// }
// // 推断的返回值类型为never
// function fail() {
//     return error('Something failed');
// }
// // 返回never的函数必须存在无法达到的终点
// function infiniteLoop(): never {
//     while (true) {}
// }
