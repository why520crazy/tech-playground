() => {
    let booleanArray: boolean[];

    booleanArray = [true, false];
    console.log(booleanArray[0]); // true
    console.log(booleanArray.length); // 2

    booleanArray[1] = true;
    booleanArray = [false, false];

    booleanArray[0] = 'false'; // Error
    booleanArray = 'false'; // Error
    booleanArray = [true, 'false']; // Error
};
