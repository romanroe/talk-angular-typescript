var app6 = angular.module("app6", []);


interface TsDirectiveScope extends ng.IScope {
    data: Person
}

class TsDirective implements ng.IDirective {
    restrict = 'E';
    scope = {
        data: "="
    };
    template = "Hallo {{data.firstname}} {{data.lastname}}!" +
        "<button ng-click='sayHello(data)'>Hello</button>";

    controller($scope: TsDirectiveScope) {
        console.log("Firstname: " + $scope.data.firstname);
    }
}

app6.directive('tsDirective', () => new TsDirective());





