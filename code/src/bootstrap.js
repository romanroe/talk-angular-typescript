
require("./002_controller/app.js");
require("./003_service/app.js");
require("./004_directive/app.js");

require("./100_typescript/main");
require("./101_classes/main");
require("./102_constructor/main");
require("./103_integration/main");
require("./104_modules/service");

require("./201_classes/app");
require("./202_api/app");
require("./203_dts/app");


angular.module('app', [
    "app2",
    "app3",
    "app4",
    "app5",
    "app6"
]);

angular.bootstrap(document, ["app"]);
