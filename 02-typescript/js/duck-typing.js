const myIterable = {
    // *[Symbol.iterator]() {
    //     yield 1;
    //     yield 2;
    //     yield 3;
    // }

    [Symbol.iterator]: function() {
        return this;
    },
    next: function() {
        return { done: true, value: 0 };
    }
};

// for (let value of myIterable) {
//     console.log(value);
// }
