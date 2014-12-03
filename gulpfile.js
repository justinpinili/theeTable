var gulp = require('gulp');
var jshint = require('gulp-jshint');
var nodemon = require('gulp-nodemon');
var mocha = require('gulp-mocha');

gulp.task('lint', function() {
  return gulp.src(['./*.js',
    './server/*.js',
    './client/**/*.js'
    ])
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('mocha', function() {
  return gulp.src('./test/**/*.js', {read: false})
    .pipe(mocha())
    .once('end', function () {
      process.exit();
    });
});

gulp.task('mocha-test', function() {
  return gulp.src('./test/**/*.js', {read: false})
    .pipe(mocha());
});

gulp.task('develop', ['lint', 'mocha-test'], function () {
  nodemon({ script: 'server.js', ext: 'html js', /*ignore: ['ignored.js']*/ })
    .on('change', ['lint', 'mocha-test'])
    .on('restart', function () {
      console.log('restarted!')
    })
});

gulp.task('default', function() {
  // place code for your default task here
});
