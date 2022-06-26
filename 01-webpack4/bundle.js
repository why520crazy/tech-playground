(function (jquery) {
    'use strict';

    function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

    var jquery__default = /*#__PURE__*/_interopDefaultLegacy(jquery);

    const a = function () {
        console.log(`a`);
    };

    var a$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        a: a
    });

    const a$2 = function () {
        console.log(`a`);
    };

    // const $ = require('jquery');
    Promise.resolve().then(function () { return a$1; }).then((m) => {
        console.log(m.a);
    });
    console.log(jquery__default['default'](".selector"));
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
    console.log(`main.js, a: ${a$2()}`);
    console.log(2);

}(jquery));
