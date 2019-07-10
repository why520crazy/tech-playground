// // infer 表示在 extends 条件语句中待推断的类型变

// type ParamType<T> = T extends (param: infer P) => any ? P : T;
// type ReturnParamType = ParamType<(key: string, name: number) => void>;

// // 1. ReturnType
// type Func = () => { name: 1 };
// type ReturnType1 = ReturnType<Func>;

// type ArgumentsType<T> = T extends (...args: infer U) => void ? U : never;

// // type SendArgumentsType<T extends keyof MessageSendData> = MessageSendData[T] extends never
// //     ? ArgumentsType<(type: T) => void>
// //     : ArgumentsType<(type: T, data: MessageSendData[T]) => void>;

// function merge<T extends { [key: string]: infer U }>(config: T) {
//     config.default;
// }

// merge({
//     default: {
//         hello: 1
//     },
//     development: {
//         myhello: 1
//     }
// });
