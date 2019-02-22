// const $ = require('jquery');
const app = angular.module("app", ["ngAnimate", function() {}]);
import 'ng-file-upload';
app.run([
    function() {
        const element$ = $("#test");
        element$.append(' + append');
        console.log(element$[0]);
    }
]);
angular.bootstrap(document, ["app"]);
