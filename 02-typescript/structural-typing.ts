class Foo {
    method(input: string): number {
        return 2;
    }
}

class Bar {
    method(input: string): number {
        return 1;
    }
}

const foo: Foo = new Foo(); // Okay.
const bar: Bar = new Foo(); // Okay.
