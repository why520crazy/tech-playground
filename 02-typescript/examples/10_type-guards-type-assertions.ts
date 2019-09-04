// let s = 'foo';
// s = null; // 错误, 'null'不能赋值给'string'
// let sn: string | null = 'bar';
// sn = null; // 可以

// sn = undefined; // error, 'undefined'不能赋值给'string | null'

// // 类型保护
// function f(sn: string | null): string {
//     if (sn == null) {
//         return 'default';
//     } else {
//         return sn;
//     }
// }

// // 类型断言
// function broken(name: string | null): string {
//     function postfix(epithet: string) {
//         return name.charAt(0) + '.  the ' + epithet; // error, 'name' is possibly null
//     }
//     name = name || 'Bob';
//     return postfix('great');
// }

// function fixed(name: string | null): string {
//     function postfix(epithet: string) {
//         return name!.charAt(0) + '.  the ' + epithet; // ok
//     }
//     name = name || 'Bob';
//     return postfix('great');
// }
