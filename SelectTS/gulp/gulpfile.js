// gulp + webpack + parallel compiler
var gulp = require("gulp");
var webpack = require('webpack');
var gutil = require('gulp-util');
var path = require('path');

// concat + license + sourcemaps
var fs = require('fs');
var replace = require('gulp-replace');
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');
var header = require('gulp-header');
var path = require('path');

// the version used to generate the license headers
var version = require(path.join(__dirname, "../package.json")).version;


/* ------------------ COMMON ------------------ */

function executeWebpack(config, callback) {
    // run webpack on the app
    webpack(config, function (err, stats) {
        if (err) throw new gutil.PluginError('webpack', err);
        gutil.log('[webpack]', stats.toString({
            // output options
        }));

        // write down the stats json for analyzing info
        var statsFileName = path.join(__dirname, "/../dist/" + config.output.filename + ".stats.json");
        fs.writeFileSync(statsFileName, JSON.stringify(stats.toJson(), null, 4));

        /*
         * concatenate the generated file with 3rd party libraries
         * add the license header and generate updated sourcemaps
         */
        var distFolder = path.join(__dirname, '../dist/');
        gulp.src([path.join(__dirname, '../dist/' + config.output.filename)])
            .pipe(sourcemaps.init({loadMaps: false}))
            .pipe(concat({path: config.output.filename}))
            .pipe(gulp.dest(distFolder))
            .pipe(header(fs.readFileSync(path.join(__dirname, "../LICENSE"), 'utf8').replace("{@VERSION}", version)))
            .pipe(sourcemaps.write('../dist/'))
            .pipe(gulp.dest(distFolder));

    });
}

/* ------------------- TASKS ------------------ */

gulp.task('default_client', function (callback) {
    var config = require('./webpack.config').config();
    config.output.filename = 'selectDemo.js';
    config.entry = path.join(__dirname, '../ts/client/SelectClient.ts');
    executeWebpack(config, callback)
});



// ----------------- TASKS WRAPPER


gulp.task('default', ['default_client']);
