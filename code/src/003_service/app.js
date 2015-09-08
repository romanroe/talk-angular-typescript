'use strict';

(function () {

    var mod = angular.module("app3", []);

    function MyController(MyService) {
        this.name = "Max";

        this.sayHello = function () {
            MyService.sayHello(this.name);
        };
    }

    mod.controller("MyController", MyController);


    function MyService() {
        this.sayHello = function (name) {
            alert("Hallo vom Service: " + name + "!");
        }
    }

    mod.service("MyService", MyService);

})();
