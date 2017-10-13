/**
 * Created by IlyaLitvinov on 06.11.16.
 */
'use strict';
const gulp = require('gulp');
const stylus = require('gulp-stylus');
const livereload = require('gulp-livereload');
const connect = require('gulp-connect');
const inject = require('gulp-inject');
const clean = require('gulp-clean');
const plumber = require('gulp-plumber');

const dirs = {
  src: 'src',
  dest: 'docs'
};

const paths = {
  src: `${dirs.src}/styles.styl`,
  dest: `${dirs.dest}/styles/`,
};


gulp.task('styles', () => {
  return gulp.src(paths.src)
    .pipe(plumber())
    .pipe(stylus())
    .pipe(gulp.dest(paths.dest))
    .pipe(livereload());

});

gulp.task('server', () => {
  connect.server({
    root: dirs.dest,
    port: 3001,
    livereload: true
  });
});

gulp.task('html', () => {
  return gulp.src('src/index.html')
    .pipe(gulp.dest(`${dirs.dest}/`))
    .pipe(connect.reload());
});

gulp.task('inject', ['styles'], () => {
  let target = gulp.src(`./${dirs.dest}/index.html`);
  let sources = gulp.src([
    `${paths.dest}*.css`
  ], {read: true});
  return target.pipe(inject(sources, {
    ignorePath: dirs.dest,
    addRootSlash: false
  }))
    .pipe(gulp.dest(dirs.dest))
    .pipe(connect.reload());
});

gulp.task('assets', () => {
  return gulp.src(['assets/**/*.png', 'assets/**/*.jpg', 'assets/**/*.svg', 'assets/**/*.ico'])
    .pipe(gulp.dest(`${dirs.dest}/assets`))
    .pipe(connect.reload());
});

gulp.task('fonts', () => {
  return gulp.src(['assets/**/*.woff2', 'assets/**/*.ttf', 'assets/**/*.woff'])
    .pipe(gulp.dest(`${dirs.dest}/assets`))
    .pipe(connect.reload());
});


gulp.task('clean', () => {
  return gulp.src([
    `${dirs.dest}/**/*.*`
  ], {read: false})
    .pipe(clean());
});

gulp.task('watch', () => {
  gulp.watch(['src/**/*.styl'], ['styles', 'inject']);
  gulp.watch(['src/**/*.html'], ['html', 'inject']);
});

gulp.task('dev', ['clean'], () => {
  gulp.run(
    'server',
    'styles',
    'html',
    'inject',
    'assets',
    'fonts',
    'watch'
  );
});

gulp.task('build', ['clean'], () => {
  gulp.run(
    'styles',
    'html',
    'inject',
    'assets',
    'fonts'
  );
});