'use strict';

(function () {

    var mod = angular.module("app2", []);

    function MyController() {
        this.name = "Max";

        this.sayHello = function () {
            alert("Hello " + this.name + "!");
        };
    }

    mod.controller("MyController", MyController);

})();
