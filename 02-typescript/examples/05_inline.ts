() => {
    let name: {
        first: string;
        second: string;
    };

    type alias Name = name;

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
};
