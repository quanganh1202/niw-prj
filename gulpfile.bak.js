"use strict";

const sep = require('path').sep,
    gulp = require('gulp'),
    sass = require('sass'),
    pleeease = require('gulp-pleeease'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    browserSync = require('browser-sync'),
    reload = browserSync.reload,
    plumber = require('gulp-plumber'),
    nodemon = require('gulp-nodemon'),
    jshint = require('gulp-jshint');
    //config = require('./config/config');

//Tận dụng việc có thể import style của scss để viết css, Sass

gulp.task('sass', function () {
    gulp.src([__config.site.theme.name, 'sass', '**', '*.scss'].join(sep))
        .pipe(sass({errLogToConsole: true}))
        .pipe(pleeease({
            autoprefixer: {
                browsers: ['last 2 versions']
            }
        }))
        .pipe(gulp.dest(['build', 'css'].join(sep)))
        .pipe(reload({stream: true}));
});

// Js-concat-uglify

gulp.task('js', function () {
    gulp.src([__config.site.theme.name, 'js', '**', '*.js'].join(sep))
        .pipe(concat('script.js'))
        .pipe(uglify({preserveComments: 'some'}))
        .pipe(gulp.dest(['build', 'js'].join(sep)))
        .pipe(reload({stream: true}))
});

// Imagemin

gulp.task('imagemin', function () {
    gulp.src([__config.site.theme.name, 'img', '**', '*.{png,jpg,gif,svg}'].join(sep))
        .pipe(imagemin({optimizationLevel: 7}))
        .pipe(gulp.dest(['build', 'img'].join(sep)));
});

gulp.task('lint', function () {
    gulp.src('./**/*.js')
        .pipe(jshint())
});

gulp.task('develop', function () {
    nodemon({
        script: 'server.js'
        , ext: 'html js'
        , ignore: ['ignored.js']
        , tasks: ['lint']
    })
        .on('restart', function () {
            console.log('restarted!')
        })
});

// Static server

gulp.task('browser-sync', function () {
    browserSync({
        server: {
            baseDir: './', // Target directory
            index: 'index.html' // index file
        }
    })
});

// Reload all browsers

gulp.task('bs-reload', function () {
    browserSync.reload();
});

// Task for `gulp` command

gulp.task('default', ['develop'], function () {
    //gulp.watch('sass/**/*.scss', ['sass']);
    //gulp.watch('js/*.js', ['js']);
    //gulp.watch('images/**/*.{png,jpg,gif,svg}', ['imagemin']);
    //gulp.watch('./*.html', ['bs-reload']);
    gulp.watch('develop');
});