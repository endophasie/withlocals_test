'use strict';

const del = require('del');
const gulp = require('gulp');
const plumber = require('gulp-plumber');
const rollup = require('gulp-better-rollup');
const sourcemaps = require('gulp-sourcemaps');
const postcss = require('gulp-postcss');
const preset = require('postcss-preset-env');
const minify = require('cssnano');
const server = require('browser-sync').create();
const mqpacker = require('css-mqpacker');
const rename = require('gulp-rename');


gulp.task('style', function () {
  gulp.src('css/style.css')
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(postcss([
      preset({
        browsers: [
          'last 2 version',
          'IE 11'
        ]
      }),
      mqpacker({sort: true})
    ]))
    .pipe(sourcemaps.write(''))
    .pipe(gulp.dest('build/css'))
    .pipe(server.stream())
    // .pipe(minify())
    // .pipe(rename('style.min.css'))
    // .pipe(gulp.dest('build/css'));
});

gulp.task('scripts', function () {
  return gulp.src('js/main.js')
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(rollup({}, 'iife'))
    .pipe(sourcemaps.write(''))
    .pipe(gulp.dest('build/js'));
});

gulp.task('copy-html', function () {
  return gulp.src('*.html')
    .pipe(gulp.dest('build'))
    .pipe(server.stream());
});

gulp.task('clean', function () {
  return del('build');
});

gulp.task('js-watch', ['scripts'], function (done) {
  server.reload();
  done();
});

gulp.task('serve', ['assemble'], function () {
  server.init({
    server: './build',
    notify: false,
    open: true,
    port: 8080,
    ui: false
  });

  gulp.watch('css/**/*.{css}', ['style']);
  gulp.watch('*.html').on('change', (e) => {
    if (e.type !== 'deleted') {
      gulp.start('copy-html');
    }
  });
  gulp.watch('js/**/*.js', ['js-watch']);
});

gulp.task('assemble', ['clean'], function () {
  gulp.start('copy-html', 'style', 'scripts');
});

gulp.task('build', ['assemble']);
