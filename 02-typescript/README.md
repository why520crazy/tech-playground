# 如何使用 TypeScript 写出类型安全的代码

- [编程语言简单介绍](#programing-language)
- [类型系统](#type-system)
- [TypeScript 基本类型](#typescript-basic-types)
- [TypeScript 泛型](#generics)
- [TypeScript 条件类型](#typescript-condition-types)
- [TypeScript 内置高级类型](#typescript-advance-types)
- [常见的场景](#scenes)
- [引用材料](#references)

## <a name="programing-language"></a>编程语言简单介绍

### 编程语言的特性

-   编程范式（编程模式）函数式，过程式，面向对象
-   基本语法（基本数据类型，定义变量，逻辑控制语句，运算符，注释，定义函数，模块加载）
-   类库和框架（包含系统模块，代码组织，库管理，社区类库框架）
-   并行计算能力
-   类型系统

### 本质上只是解决下面2个问题

-   如何表示信息
-   如何处理信息

一门编程语言构成了一个独立的世界，这个世界是由一些“基本粒子”（基本存储单元），按照一定的组合方式构成的
究竟有哪些是基本粒子，又允许进行何种组合对编程语言所构成的世界最终的宏观结果影响非常巨大。

所以花费一些时间对语言的本质进行研究，会对深入理解语言背后的设计考虑有很大的帮助。也能让我们避免陷入语言的陷阱，或者陷入与别人的口水战之中。

## 类型系统

**类型系统** 用于定义如何将编程语言中的数值和表达式归类为许多不同的类型，如何操作这些类型，这些类型如何互相作用。类型可以确认一个值或者一组值具有特定的意义和目的（虽然某些类型，如抽象类型和函数类型，在程序运行中，可能不表示为值）。类型系统在各种语言之间有非常大的不同，也许，最主要的差异存在于编译时期的语法，以及运行时期的操作实现方式。

-   Nominal Typing System 标明类型系统 (Java，C#，C++)
-   Structural Typing 结构类型系统 (OCaml, Haskell, and Elm)

C#
```
public class Foo  
{
    public string Name { get; set; }
    public int Id { get; set;}
}

public class Bar  
{
    public string Name { get; set; }
    public int Id { get; set; }
}

Foo foo = new Foo(); // Okay.
Bar bar = new Foo(); // Error!!!
```

TypeScript

```
class Foo {
  method(input: string): number { ... }
}

class Bar {
  method(input: string): number { ... }
}

const foo: Foo = new Foo(); // Okay.
const bar: Bar = new Foo(); // Okay.
```

TypeScript 为什么使用 `Structural Typing` ?

> TypeScript 是 JavaScript 的超集，JS 是一门动态脚本语言，并且鸭子类型应用广泛，比如 `Iterable`，只需要实现 @@iterator 方法即可

## <a name="typescript-basic-types"></a>TypeScript 基本类型
### 基本使用

```
const aNumber: number = 123;
function identity(aNumber: number): number {
  return aNumber;
}
```

### 原始类型

```
let aNumber: number;
let aString: string;
let aBoolean: boolean;

aNumber = 123;
aNumber = 123.456;
aNumber = '123'; // Error

aString = '123';
aString = 123; // Error

aBoolean = true;
aBoolean = false;
aBoolean = 'false'; // Error
```

### 数组 Array

```
let booleanArray: boolean[]; // 数组泛型 Array<boolean>

booleanArray = [true, false];
console.log(booleanArray[0]); // true
console.log(booleanArray.length); // 2

booleanArray[1] = true;
booleanArray = [false, false];

booleanArray[0] = 'false'; // Error
booleanArray = 'false'; // Error
booleanArray = [true, 'false']; // Error
```


### `null`、 `undefined`、 `any`、 `void`、`never`、`object`

- null 和 undefined, 默认情况下 null 和 undefined 是所有类型的子类型, 可以把 null 和 undefined 赋值给 number 类型的变量, strictNullChecks
- any 表示任何类型, 兼容 Javascript, 已有系统的改造特别有用, 对于一个合格的软件工程师来说, 尽量避免使用 any
- void 表示没有任何类型, 没有返回值使用 void, 声明一个 void 类型的变量没有什么用, 只能赋值 null 和 undefined
- never 类型表示永不存在的值的类型, never 类型是任何类型的子类型，也可以赋值给任何类型，然而，没有类型是 never 的子类型或可以赋值给never 类型（除了never本身之外）， 即使 any 也不可以赋值给 never
- object 表示非原始类型，也就是除 number，string，boolean，symbol，null或undefined 之外的类型

```
// Null Or Undefined
let aUndefined: undefined = undefined; // Oky
aUndefined = null; // Oky
aUndefined = 1; // Error

let aNull: null = null; // Oky
aNull = undefined; // Oky
aNull = 1; // Error

// Any
let notSure: any = 4;
notSure.ifItExists(); // okay, ifItExists might exist at runtime
notSure.toFixed(); // okay, toFixed exists (but the compiler doesn't check)

let prettySure: object = 4;
prettySure.toFixed(); // Error: Property 'toFixed' doesn't exist on type 'Object'.

// Void
function warnUser(): void {
    console.log('This is my warning message');
}
let unusable: void = undefined;

// Never
// 返回 never 的函数必须存在无法达到的终点
function error(message: string): never {
    throw new Error(message);
}
// 推断的返回值类型为never
function fail() {
    return error('Something failed');
}
// 返回never的函数必须存在无法达到的终点
function infiniteLoop(): never {
    while (true) {}
}
```

### 接口 Interface

```
interface Name {
    first: string;
    second: string;
    getFullName?(): boolean;
}

let aName: Name;
aName = {
    first: 'John',
    second: 'Doe'
};

aName = {
    // Error: 'Second is missing'
    first: 'John'
};

aName = {
    // Error: 'Second is the wrong type'
    first: 'John',
    second: 1337
};

```

可选属性 `?`，有些属性是只在某些条件下存在，或者根本不存在。

```
interface SquareConfig {
    color?: string;
    width?: number;
}
```

只读属性
```
interface Point {
    readonly x: number;
    readonly y: number;
}
let p1: Point = { x: 10, y: 20 };
p1.x = 5; // error!
```

顺便说下 `ReadonlyArray<T>` 和 `Array<T>` 区别

```
let aArray: number[] = [1, 2, 3, 4];
let aReadonlyArray: ReadonlyArray<number> = a;
aReadonlyArray[0] = 12; // error!
aReadonlyArray.push(5); // error!
aReadonlyArray.length = 100; // error!
aArray = aReadonlyArray; // error!
aArray = aReadonlyArray as number[]; // Okay
```

接口继承接口
```
interface Shape {
    color: string;
}

interface Square extends Shape {
    sideLength: number;
}

let square = <Square>{};
square.color = "blue";
square.sideLength = 10;
```

### 额外的属性检查 Excess Property Checks

```
interface Point {
    x: number;
    y: number;
};

function draw(point: Point) {
    console.log(point);
}

draw({ x: 10, y: 25 }); // Okay.
// Extra fields Okay. Need enable `suppressExcessPropertyErrors: true`
draw({ x: 8, y: 13, name: 'foo' });
draw({ x: 8, y: 13, name: 'foo' } as Point);
const point = { x: 8, y: 13, name: 'foo' };
draw(point);

```

### 可索引的类型 Indexable Types

可索引类型具有一个索引签名，它描述了对象索引的类型，还有相应的索引返回值类型, TypeScript支持两种索引签名：字符串和数字.


```
interface StringArray {
  [index: number]: string;
}

let myArray: StringArray;
myArray = ["Bob", "Fred"];

let myStr: string = myArray[0];
```

可以同时使用两种类型的索引，但是数字索引的返回值必须是字符串索引返回值类型的子类型。 这是因为当使用 number来索引时，JavaScript会将它转换成string然后再去索引对象。 也就是说用 100（一个number）去索引等同于使用"100"（一个string）去索引，因此两者需要保持一致。

```

class Animal {
    name: string;
}
class Dog extends Animal {
    breed: string;
}

interface NotOkay {
    [x: number]: Animal; // 数字索引类型“Animal”不能赋给字符串索引类型“Dog”。
    [x: string]: Dog;
}

interface NumberDictionary {
  [index: string]: number;
  length: number;    // 可以，length是number类型
  name: string       // 错误，类型“string”的属性“name”不能赋给字符串索引类型“number”。
}

```
索引签名设置为只读
```
interface ReadonlyStringArray {
    readonly [index: number]: string;
}
let myArray: ReadonlyStringArray = ['Alice', 'Bob'];
myArray[2] = 'Mallory'; // error!
```

### 内联类型

快速的提供一个类型，省去为类型起名（你可能会使用一个很糟糕的名称）, 发现需要多次使用相同的内联注解时，考虑把它重构为一个接口。

```
let aName: {
    first: string;
    second: string;
};

aName = {
    first: 'John',
    second: 'Doe'
};

aName = {
    // Error: 'Second is missing'
    first: 'John'
};

aName = {
    // Error: 'Second is the wrong type'
    first: 'John',
    second: 1337
};

type Name = typeof aName; // 获取 aName 的类型

const typeOfStr = typeof '';
```


### 回顾类型的几个知识点

- 可选属性 ?, 可选参数也是使用 ?
- 只读属性 readonly 
- never
- 字符串和数字索引类型
- typeof 获取内联类型

## <a name="generics"></a>泛型 Generics

#### 范型基本使用

创建一个 identity 函数, 这个函数会返回任何传入它的值，不用范型有哪几种方式实现这个函数？

```
function identity(arg: number): number {
    return arg;
}
```

泛型其实就是类型变量，它是一种特殊的变量，只用于表示类型而不是值，使返回值的类型与传入参数的类型是相同的

```
function identity<T>(arg: T): T {
    return arg;
}
```

#### 使用泛型变量
```
function loggingIdentity<T>(arg: T): T {
    console.log(arg.length);  // Error: T doesn't have .length
    return arg;
}

function loggingIdentity<T>(arg: T[]): T[] {
    console.log(arg.length);  // Array has a .length, so no more error
    return arg;
}
```

#### 泛型类型, 泛型接口
```
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
```

#### 泛型类

```
class GenericNumber<T> {
    zeroValue: T;
    add: (x: T, y: T) => T;
}

let myGenericNumber = new GenericNumber<number>();
myGenericNumber.zeroValue = 0;
myGenericNumber.add = function(x, y) { return x + y; };
```

类有两部分：静态部分和实例部分。 泛型类指的是实例部分的类型，所以类的静态属性不能使用这个泛型类型。

#### 泛型约束

```
interface Lengthwise {
    length: number;
}

function loggingIdentity<T extends Lengthwise>(arg: T): T {
    console.log(arg.length);  // Now we know it has a .length property, so no more error
    return arg;
}

loggingIdentity(3);  // Error, number doesn't have a .length property
loggingIdentity({length: 10, value: 3});
```

## Conditional Types

## TypeScript 内置的高级类型

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


## 反模式

```
const condition: any = {
    project_id: context.project._id,
    is_deleted: { $ne: Is.yes },
    is_archived: { $ne: Is.yes }
};

if (!_.isNil(view.priority)) {
    const option = this.validateOptions(ScrumDefectStatisticsProperties.priority, _.parseId(view.priority));
    condition.priority = option._id;
}
```

## <a name="references"></a>引用材料
https://www.typescriptlang.org/docs/home.html
https://www.tslang.cn/docs/handbook/basic-types.html
https://zh.wikipedia.org/wiki/%E9%A1%9E%E5%9E%8B%E7%B3%BB%E7%B5%B1
https://zhuanlan.zhihu.com/p/64446259
https://www.zhihu.com/question/23434097
https://juejin.im/post/5cffb431f265da1b7401f466
````
