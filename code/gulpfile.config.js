'use strict';
var GulpConfig = (function () {
    function GulpConfig() {

        // ----------------------------------------------------------
        // Output
        // ----------------------------------------------------------

        this.target = "target";

        this.targetApp = this.target + "/app";

        this.targetJs = this.targetApp;

        // ----------------------------------------------------------
        // Vendor
        // ----------------------------------------------------------

        this.vendor = [
            "bower_components/angular**/angular.js"
        ];

        // ----------------------------------------------------------
        // Source Paths
        // ----------------------------------------------------------

        //this.source = 'app';

        this.htmlFiles = [
            "src/**/*.html"
        ];

        this.cssFiles = [
            "src/**/*.css"
        ];

        this.scssFiles = [];

        this.cssFiles = ["src/**/*.css"];

        this.typeScriptFiles = [
            "typings/*/*.d.ts",
            "src/**/*.ts"
        ];

        this.typeScriptLintFiles = ["src/**/*.ts"];

        this.javaScriptFiles = [
            "!src/**/*.spec.js",
            "src/**/*.js"
        ];

        this.copyFiles = [
            ["src/app/**/*.css", ""]/*,
             ["src/app/partials/!**!/!*", "partials"]*/
        ];

        // ----------------------------------------------------------
        // Browsersync Options
        // ----------------------------------------------------------

        this.browsersyncOptions = {
            open: false,
            online: false,
            port: 10000,
            server: {
                baseDir: "target/app",
                directory: true
            },
            files: this.targetApp + '/**/*'
        };

        // ----------------------------------------------------------
        // SystemJS
        // ----------------------------------------------------------

        this.systemImportMain = "/bootstrap";

        this.systemJSConfig = {
            baseURL: '',
            defaultJSExtensions: true,

            "paths": {
                "*": "*.js"
            }
        };

    }

    return GulpConfig;
})();
module.exports = GulpConfig;
