'use strict';

var fs = require('fs');
var del = require('del');
var mkdirp = require('mkdirp');
var merge = require('merge2');
var assign = require('lodash.assign');
var series = require('stream-series');
var sequence = require('run-sequence');

var path = require("path");
var Builder = require('systemjs-builder');

var gulp = require('gulp');
var debug = require('gulp-debug');
var concat = require('gulp-concat');
var watch = require('gulp-watch');
var sourcemaps = require('gulp-sourcemaps');
var gutil = require('gulp-util');
var htmlmin = require('gulp-htmlmin');
var browsersync = require('browser-sync');
var cache = require('gulp-cached');
var addsrc = require('gulp-add-src');

var sass = require('gulp-sass');

var inject = require('gulp-inject');
var ts = require('gulp-typescript');
var tslint = require('gulp-tslint');
var source = require("vinyl-source-stream");
var buffer = require("vinyl-buffer");
var plumber = require('gulp-plumber');

var Config = require('./gulpfile.config');
var config = new Config();

var developmentMode = false;


// ------------------------------------------------------------------
// clean
// ------------------------------------------------------------------
gulp.task('clean', function (cb) {
    del([config.target], cb);
});

// ------------------------------------------------------------------
// Build Libraries
// ------------------------------------------------------------------

gulp.task('build:vendor', [], function () {
    var js = [];
    var css = [];
    config.vendor.forEach(function (elem) {
        if (elem.substr(-3) === ".js") {
            js.push(elem);
        } else if (elem.substr(-4) === ".css") {
            css.push(elem);
        } else {
            console.log("[ERROR] Unkown type:" + elem);
        }
    });
    var streamJs = gulp.src(js)
        .pipe(concat("vendor.js"))
        .pipe(gulp.dest(config.targetApp + "/vendor"));

    var streamCss = gulp.src(css)
        .pipe(concat("vendor.css"))
        .pipe(gulp.dest(config.targetApp + "/vendor"));

    var streamSystemJs = gulp.src(
        ["system-polyfills.js", "system.js"],
        {cwd: "node_modules/systemjs/dist"})
        .pipe(gulp.dest(config.targetApp + "/systemjs"));

    if (developmentMode) {
        var entryGenerated = "System.config(";
        entryGenerated += JSON.stringify(config.systemJSConfig);
        entryGenerated += ");\n";
        entryGenerated += "System.import('" + config.systemImportMain + "');";
        mkdirp(config.targetApp + "/systemjs", function () {
            fs.writeFileSync(config.targetApp + "/systemjs/entry-generated.js", entryGenerated);
        });
    }

    return merge(streamJs, streamCss, streamSystemJs);
});

// ------------------------------------------------------------------
// Build HTML
// ------------------------------------------------------------------

gulp.task('build:html', [], function () {
    var s = gulp.src(config.htmlFiles);
    s = s.pipe(cache("html"));
    s = s.pipe(gulp.dest(config.targetApp));
    s = s.pipe(inject(series(
        gulp.src(
            ["vendor/**/*.js", "vendor/**/*.css"],
            {read: false, cwd: config.targetApp}),

        gulp.src(
            ["systemjs/system.js", "systemjs/system-polyfills.js", "systemjs/entry-generated.js"],
            {read: false, cwd: config.targetApp}),

        gulp.src(
            ['**/*.css', "!vendor/**", "!systemjs/**"],
            {read: false, cwd: config.targetApp})
    ), {relative: true, quiet: true}));
    s = s.pipe(htmlmin({
        collapseWhitespace: false,
        removeComments: false
    }));
    s = s.pipe(gulp.dest(config.targetApp));

    return s;
});


// ------------------------------------------------------------------
// Build Copy files
// ------------------------------------------------------------------

gulp.task('build:copy', function () {
    var copyStreams = [];
    for (var i = 0; i < config.copyFiles.length; i++) {
        var source = config.copyFiles[i][0];
        var dest = config.copyFiles[i][1];
        copyStreams.push(
            gulp.src(source)
                .pipe(gulp.dest(config.targetApp + "/" + dest)));
    }
    return merge(copyStreams);
});

// ------------------------------------------------------------------
// Build CSS
// ------------------------------------------------------------------

gulp.task('build:css', function () {
    var scss = gulp.src(config.scssFiles, {nosort: true});
    scss = scss.pipe(cache("scss"));
    scss = developmentMode ? scss.pipe(sourcemaps.init()) : scss;
    scss = scss.pipe(sass().on('error', sass.logError));
    scss = developmentMode ? scss.pipe(sourcemaps.write()) : scss;
    scss = developmentMode ? scss.pipe(gulp.dest(config.targetApp)) : scss;

    var css = gulp.src(config.cssFiles);
    css = css.pipe(cache("css"));

    var both = merge(scss, css);
    both = !developmentMode ? both.pipe(concat("___.css")) : both;
    both = both.pipe(gulp.dest(config.targetApp));
    return both;
});

// ------------------------------------------------------------------
// Build JavaScript
// ------------------------------------------------------------------

function buildJs() {
    var s = gulp.src(config.javaScriptFiles, {nosort: true});
    s = s.pipe(cache("js"));
    s = developmentMode ? s.pipe(sourcemaps.init()) : s;
    s = developmentMode ? s.pipe(sourcemaps.write()) : s;
    s = s.pipe(gulp.dest(config.targetJs));
    return s;
}

gulp.task('build:js', function () {
    return buildJs();
});


// ------------------------------------------------------------------
// Build TypeScript
// ------------------------------------------------------------------

var tsProject = ts.createProject('tsconfig.json');

gulp.task('build:ts', function () {
    //if (developmentMode) {
    //    gulp.src(config.typeScriptLintFiles)
    //        .pipe(cache("lint:ts"))
    //        .pipe(tslint()).pipe(tslint.report('prose', {emitError: false}));
    //}

    var tsResult = gulp.src(config.typeScriptFiles);

    tsResult = developmentMode ? tsResult.pipe(sourcemaps.init()) : tsResult;
    tsResult = tsResult.pipe(ts(tsProject, undefined, ts.reporter.longReporter()));

    var tsResultJs = tsResult.js;
    tsResultJs = tsResultJs.pipe(cache("ts"));

    if (developmentMode) {
        tsResultJs = tsResultJs.pipe(sourcemaps.write());
    }

    return merge([
        tsResult.dts.pipe(gulp.dest(config.target + "/dts")),
        tsResultJs.pipe(gulp.dest(config.targetJs + "/"))
    ]);
});


// ------------------------------------------------------------------
// Build Bundle
// ------------------------------------------------------------------

gulp.task('bundle', [], function (done) {

    config.systemJSConfig.baseURL = config.targetJs + "/" + config.systemJSConfig.baseURL;

    new Builder(config.systemJSConfig)
        .buildSFX("app.js", config.targetApp + "/systemjs/entry-generated.js", {minify: false})
        .then(function () {
            done();
        })
        .catch(function (err) {
            console.log('Build error');
            console.log(err);
        });
});


// ------------------------------------------------------------------
// BrowserSync
// ------------------------------------------------------------------

gulp.task('browsersync', ["dev"], function () {
    return browsersync(config.browsersyncOptions);
});

// ------------------------------------------------------------------
// Start Tasks
// ------------------------------------------------------------------

gulp.task('watch', ["browsersync"], function () {
    developmentMode = true;
    gulp.watch(config.typeScriptFiles, ["build:ts"]);
    gulp.watch(config.javaScriptFiles, ["build:js"]);
    gulp.watch(config.htmlFiles, ["build:html"]);
    gulp.watch(config.scssFiles, ["build:css"]);
    gulp.watch(config.cssFiles, ["build:css"]);
});

gulp.task('dev', function (callback) {

    config.targetJs = config.targetApp;

    developmentMode = true;
    sequence(
        ["build:vendor", "build:copy", "build:js", "build:ts", "build:css"],
        "build:html",
        callback);
});

gulp.task('dist', function (callback) {

    config.targetJs = config.target + "/tmpJs";

    sequence(
        "clean",
        ["build:vendor", "build:copy", "build:js", "build:ts", "build:css"],
        "bundle",
        "build:html",
        callback);
});

gulp.task('default', ["dist"]);



