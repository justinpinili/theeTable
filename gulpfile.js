var gulp = require('gulp');
var jshint = require('gulp-jshint');
var nodemon = require('gulp-nodemon');
var mocha = require('gulp-mocha');
var karma = require('karma').server;

gulp.task('lint', function() {
  return gulp.src(['./*.js',
    './server/*.js',
    './client/**/*.js'
    ])
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('mocha', function() {
  return gulp.src('./test/server/*.js', {read: false})
    .pipe(mocha())
    .once('end', function () {
      process.exit();
    });
});

gulp.task('mocha-test', function() {
  return gulp.src('./test/server/*.js', {read: false})
    .pipe(mocha());
});

gulp.task('karma-test', function (done) {
  karma.start({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, done);
});

gulp.task('develop', ['lint', 'karma-test', 'mocha-test'], function () {
  nodemon({ script: 'server.js', ext: 'html js', /*ignore: ['ignored.js']*/ })
    .on('change', ['lint', 'karma-test', 'mocha-test'])
    .on('restart', function () {
      console.log('restarted!')
    })
});

gulp.task('default', function() {
  // place code for your default task here
});
