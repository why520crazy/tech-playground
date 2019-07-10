(() => {
    const number: number = 1;
    const str: string = 'str';
    const boolean: boolean = true;
    const strArray: string[] = ['1', '2'];
    const obj = { name: '', age: 1 };

    interface UserInfo {
        _id?: string;
        name?: string;
        age?: number;
    }

    // Required
    const userInfo: UserInfo = {};
    type RequiredUserInfo = Required<UserInfo>;
    // const requiredUserInfo: RequiredUserInfo = {};

    // Readonly
    type ReadonlyUserInfo = Readonly<UserInfo>;
    const readonlyUserInfo: ReadonlyUserInfo = {};
    // readonlyUserInfo.age = 1;

    // Partial
    type PartialUserInfo = Partial<UserInfo>;
    const partialUserInfo: PartialUserInfo = {
        name: 'partial name'
        // name2: ''
    };

    // Pick
    type PickUserInfo = Pick<UserInfo, 'name' | '_id'>;
    const pickUserInfo: PickUserInfo = {
        name: 'partial name'
        // age: 1
    };

    // Record
    type RecordUserInfo = Record<'user', UserInfo>;
    const recordUserInfo: RecordUserInfo = {
        user: {
            name: 'partial name'
        }
        // name2: ''
    };

    // Exclude
    class BookInfo {
        name: string;
    }

    class ChildBookInfo extends BookInfo {}

    class FooInfo {}

    type ExcludeBookInfo = Exclude<ChildBookInfo, BookInfo>;
    type ExcludeFooInfo = Exclude<FooInfo, BookInfo>;

    type ExcludeUserInfo = Exclude<{ name: string }, UserInfo>;
    type ExcludeUserInfo1 = Exclude<number, UserInfo>;
    const excludeUserInfo: RecordUserInfo = {
        user: {
            name: 'partial name'
        }
        // name2: ''
    };

    // Extract
    type ExtractUserInfo = Extract<{ name: string }, UserInfo>;
    type ExtractNumber = Extract<number, UserInfo>;
    const extract: ExtractUserInfo = {
        name: 'partial name'
        // name2: ''
    };

    // NonNullable
    type NonNullableUserInfo = NonNullable<UserInfo>;
    type NonNullableNull = NonNullable<null>;

    const nonNullableUserInfo: NonNullableUserInfo = {
        name: 'partial name'
        // name2: ''
    };

    // Parameters
    type ParametersArray = Parameters<(name: string, age: number) => void>;

    // ConstructorParameters
    class Dog {
        name: string;
        age: number;
        constructor(name: string, age: number) {
            this.name = name;
            this.age = age;
        }
    }

    function getDog<T extends new (...args: any) => any>(t: T): ConstructorParameters<T> {
        return ['x', 1] as ConstructorParameters<T>;
    }

    type DogConstructorParameters = ConstructorParameters<typeof Dog>;
    const dog: DogConstructorParameters = ['', 1];
    // const dog1: DogConstructorParameters = getDog(new Dog('name', 1));

    // ReturnType
    type ReturnType1 = ReturnType<() => number>;

    // InstanceType
    type InstanceType1 = InstanceType<typeof Dog>;

    // ThisType
    type ThisType1 = ThisType<typeof Dog>;

    // - Required
    // - Readonly
    // - Partial
    // - Pick
    // - Record
    // - Exclude
    // - Extract
    // - Omit
    // - NonNullable
    // - Parameters
    // - ConstructorParameters
    // - ReturnType
    // - InstanceType
    // - ThisType
})();
