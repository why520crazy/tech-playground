function identity<T>(arg: T): T {
    return arg;
}

let myIdentity: <T>(arg: T) => T = identity;
let myIdentity2: <U>(arg: U) => U = identity;
// 带有调用签名的对象字面量来定义泛型函数
let myIdentity3: {<T>(arg: T): T} = identity;
// 泛型接口
interface GenericIdentityFn {
    <T>(arg: T): T;
}
let myIdentity4: GenericIdentityFn = identity;

// 把泛型参数当作整个接口的一个参数
interface GenericIdentityFn5<T> {
    (arg: T): T;
}
let myIdentity5: GenericIdentityFn5<number> = identity;
