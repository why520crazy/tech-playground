// const $ = require('jquery');
import jquery from "jquery";
import { a } from './a.js';
import { a as b } from './b.js';
import('./a').then((m) => {
    console.log(m.a);
});
console.log(jquery(".selector"));
// require('angular');
// const element$ = $("#test");
// const app = angular.module("app", ["ngAnimate", function() {}]);
// import 'ng-file-upload';
// app.run([
//     function() {
//         const element$ = $("#test");
//         element$.append(" + append");
//         console.log(element$[0]);
//     }
// ]);
// angular.bootstrap(document, ["app"]);

// const a = require('./a.js');
console.log(`main.js, a: ${a()}`);
console.log(`main.js, a: ${b()}`);
console.log(2);
