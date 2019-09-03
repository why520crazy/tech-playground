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

interface SquareConfig {
    color?: string;
    width?: number;
}

interface Point {
    readonly x: number;
    readonly y: number;
}

let p1: Point = { x: 10, y: 20 };
p1.x = 5; // error!

let aArray: number[] = [1, 2, 3, 4];
let aReadonlyArray: ReadonlyArray<number> = a;
aReadonlyArray[0] = 12; // error!
aReadonlyArray.push(5); // error!
aReadonlyArray.length = 100; // error!
aArray = aReadonlyArray; // error!
aArray = aReadonlyArray as number[]; // Okay
