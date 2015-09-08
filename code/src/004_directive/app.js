'use strict';

(function () {

    var mod = angular.module("app4", []);

    function MyController() {
        this.person1 = {firstname: "Max", lastname: "Mustermann"};
        this.person2 = {firstname: "John", lastname: "Doe"};
    }

    mod.controller("MyController", MyController);

    // --------------------------------------------------------------

    function PersonDirective() {
        return {
            restrict: "E",
            scope: {
                data: "="
            },
            controller: function ($scope) {
                $scope.sayHello = function (person) {
                    alert("Hello " + person.firstname + "!");
                }
            },
            template: "Hallo {{data.firstname}} {{data.lastname}}!" +
            "<button ng-click='sayHello(data)'>Hello</button>"
        }
    }

    mod.directive("person", PersonDirective);


})();
