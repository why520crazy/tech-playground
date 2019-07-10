() => {
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
};
