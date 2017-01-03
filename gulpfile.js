var gulp = require('gulp');
var webpack = require('webpack');
var config = require('./webpack.config');
var exec = require("gulp-exec");

gulp.task('webpack', function (callback) { // run webpack
    webpack(config, function(err, stats) {
        if(err) throw new gutil.PluginError("webpack", err);
        callback();
    });
});

gulp.task('copy',function () {
    gulp.src( [ "./src/**/*.html" , "./src/**/*.json" , "./src/lib/*" , "./src/background.js"],
    {base:"src"} )
    .pipe( gulp.dest("./dist") );
})

gulp.task("default",["copy","webpack"])