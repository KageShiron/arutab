var gulp = require('gulp');
var webpack = require('gulp-webpack');
var config = require('./webpack.config');

gulp.task('webpack', function () {
    gulp.src(config.entry)
        .pipe(webpack(config))
        .pipe(gulp.dest("dist"));
});

gulp.task('copy',function () {
    gulp.src( [ "./src/*.html" , "./src/*.json" , "./src/lib/*"],
    {base:"src"} )
    .pipe( gulp.dest("./dist") );
})

gulp.task("default",["copy","webpack"])