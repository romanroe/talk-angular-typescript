var mod = angular.module("app5", []);


class TsController {

    private counter = 0;
    name: string;

    constructor() {
        this.name = "Max";
    }

    sayHello() {
        alert((this.counter++) + " Hello from TS!");
    }
}

mod.controller("TsController", TsController);


class TsService {

    private counter = 0;

    sayHello() {
        alert((this.counter++) + " Hello from TsService!");
    }
}

mod.service("tsService", TsService);

class TsController2 {

    name: string;
    sayHello: () => void;
    privateCounter = 0;

    constructor(tsService: TsService) {
        this.name = "Max";
        this.sayHello = function () {
            tsService.sayHello();
        };
    }
}

mod.controller("TsController2", TsController2);
