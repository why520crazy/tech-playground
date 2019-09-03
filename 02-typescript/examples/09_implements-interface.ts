// // interface ClockConstructor {
// //     new (hour: number, minute: number): void;
// // }

// // // 类“Clock”错误实现接口“ClockConstructor”。
// // // 类型“Clock”提供的内容与签名“new (hour: number, minute: number): void”不匹配
// // class Clock implements ClockConstructor {
// //     currentTime: Date;
// //     constructor(h: number, m: number) {
// //     }
// // }

// interface ClockConstructor {
//     new (hour: number, minute: number): ClockInterface;
// }
// interface ClockInterface {
//     tick(): void;
// }

// function createClock(ctor: ClockConstructor, hour: number, minute: number): ClockInterface {
//     return new ctor(hour, minute);
// }

// class DigitalClock implements ClockInterface {
//     constructor(h: number, m: number) {}
//     tick() {
//         console.log('beep beep');
//     }
// }
// class AnalogClock implements ClockInterface {
//     constructor(h: number, m: number) {}
//     tick() {
//         console.log('tick');
//     }
// }

// let digital = createClock(DigitalClock, 12, 17);
// let analog = createClock(AnalogClock, 7, 32);
