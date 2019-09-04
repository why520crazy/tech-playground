// interface Bird {
//     fly(): void;
//     layEggs(): void;
// }

// interface Fish {
//     swim(): void;
//     layEggs(): void;
// }

// function getSmallPet(): Fish | Bird {
//     return null;
// }

// // let pet = getSmallPet();

// // // 每一个成员访问都会报错
// // if (pet.swim) {
// //     pet.swim();
// // }
// // else if (pet.fly) {
// //     pet.fly();
// // }

// let pet = getSmallPet();
// if ((<Fish>pet).swim) {
//     (<Fish>pet).swim();
// } else {
//     (<Bird>pet).fly();
// }

// // 用户自定义的类型保护
// function isFish(pet: Fish | Bird): pet is Fish {
//     return (<Fish>pet).swim !== undefined;
// }

// if (isFish(pet)) {
//     pet.swim();
// } else {
//     pet.fly();
// }

// // typeof
// function padLeft(value: string, padding: string | number) {
//     if (typeof padding === 'number') {
//         return Array(padding + 1).join(' ') + value;
//     }
//     if (typeof padding === 'string') {
//         return padding + value;
//     }
//     throw new Error(`Expected string or number, got '${padding}'.`);
// }

// // in operator
// function move(pet: Fish | Bird) {
//     if ('swim' in pet) {
//         return pet.swim();
//     }
//     return pet.fly();
// }
