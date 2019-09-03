interface Square {
    kind: 'square';
    size: number;
}
interface Rectangle {
    kind: 'rectangle';
    width: number;
    height: number;
}
interface Circle {
    kind: 'circle';
    radius: number;
}

interface Triangle {
    kind: 'triangle';
    width: number;
    height: number;
}

type Shape = Square | Rectangle | Circle | Triangle;

function area(s: Shape): number {
    switch (s.kind) {
        case 'square':
            return s.size * s.size;
        case 'rectangle':
            return s.height * s.width;
        case 'circle':
            return Math.PI * s.radius ** 2;
    }
}

// 第一种方式 开启 strictNullChecks

// 第二种方法使用 never 类型，编译器用它来进行完整性检查
function assertNever(x: never): never {
    throw new Error('Unexpected object: ' + x);
}
function area1(s: Shape): number {
    switch (s.kind) {
        case 'square':
            return s.size * s.size;
        case 'rectangle':
            return s.height * s.width;
        case 'circle':
            return Math.PI * s.radius ** 2;
        // case 'triangle':
        //     return (s.width * s.height) / 2;
        default:
            return assertNever(s); // error here if there are missing cases
    }
}
