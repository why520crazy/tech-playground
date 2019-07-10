() => {
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
};
