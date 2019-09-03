// interface Point {
//     x: number;
//     y: number;
// };

// function draw(point: Point) {
//     console.log(point);
// }

// draw({ x: 10, y: 25 }); // Okay.
// // Extra fields Okay. Need enable `suppressExcessPropertyErrors: true`
// draw({ x: 8, y: 13, name: 'foo' });
// draw({ x: 8, y: 13, name: 'foo' } as Point);
// const point = { x: 8, y: 13, name: 'foo' };
// draw(point);
