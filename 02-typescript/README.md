TypeScript 类型系统随便玩

## 编程语言

### 编程语言的特性

-   编程范式（编程模式）函数式，过程式，面向对象
-   基本语法（基本数据类型，定义变量，逻辑控制语句，运算符，注释，定义函数，模块加载）
-   类库和框架（包含系统模块，代码组织，库管理，社区类库框架）
-   并行计算能力
-   类型系统

### 本质上只是解决下面 2 个问题

-   如何表示信息
-   如何处理信息

一门编程语言构成了一个独立的世界，这个世界是由一些“基本粒子”（基本存储单元），按照一定的组合方式构成的
究竟有哪些是基本粒子，又允许进行何种组合对编程语言所构成的世界最终的宏观结果影响非常巨大。

所以花费一些时间对语言的本质进行研究，会对深入理解语言背后的设计考虑有很大的帮助。也能让我们避免陷入语言的陷阱，或者陷入与别人的口水战之中。

## 类型系统

**类型系统** 用于定义如何将编程语言中的数值和表达式归类为许多不同的类型，如何操作这些类型，这些类型如何互相作用。类型可以确认一个值或者一组值具有特定的意义和目的（虽然某些类型，如抽象类型和函数类型，在程序运行中，可能不表示为值）。类型系统在各种语言之间有非常大的不同，也许，最主要的差异存在于编译时期的语法，以及运行时期的操作实现方式。

-   Nominal Typing System 标明类型系统 (Java，C#，C++)
-   Structural Typing 结构类型系统 (OCaml, Haskell, and Elm)

## TypeScript 中的类型系统

### 基本使用

```
const number: number = 123;
function identity(number: number): number {
  return number;
}
```

### 原始类型

```
let number: number;
let string: string;
let boolean: boolean;

number = 123;
number = 123.456;
number = '123'; // Error

string = '123';
string = 123; // Error

boolean = true;
boolean = false;
boolean = 'false'; // Error
```

### 数组 Array

````
let booleanArray: boolean[];

booleanArray = [true, false];
console.log(booleanArray[0]); // true
console.log(booleanArray.length); // 2

booleanArray[1] = true;
booleanArray = [false, false];

booleanArray[0] = 'false'; // Error
booleanArray = 'false'; // Error
booleanArray = [true, 'false']; // Error

```

### 接口 Interface

```
interface Name {
    first: string;
    second: string;
}

let name: Name;
name = {
    first: 'John',
    second: 'Doe'
};

name = {
    // Error: 'Second is missing'
    first: 'John'
};

name = {
    // Error: 'Second is the wrong type'
    first: 'John',
    second: 1337
};

```

### 内联类型

快速的提供一个类型，省去为类型起名（你可能会使用一个很糟糕的名称）, 发现需要多次使用相同的内联注解时，考虑把它重构为一个接口。

```
let name: {
    first: string;
    second: string;
};

name = {
    first: 'John',
    second: 'Doe'
};

name = {
    // Error: 'Second is missing'
    first: 'John'
};

name = {
    // Error: 'Second is the wrong type'
    first: 'John',
    second: 1337
};
```

### 特殊的类型
`any`、 `null`、 `undefined` 以及 `void`。

### 

### Conditional Types

### 内置的类型

- Required
- Readonly
- Partial
- Pick
- Record
- Exclude
- Extract
- Omit
- NonNullable
- Parameters
- ConstructorParameters
- ReturnType
- InstanceType
- ThisType


## 引用

https://zh.wikipedia.org/wiki/%E9%A1%9E%E5%9E%8B%E7%B3%BB%E7%B5%B1
https://zhuanlan.zhihu.com/p/64446259
https://www.zhihu.com/question/23434097
https://juejin.im/post/5cffb431f265da1b7401f466
````
