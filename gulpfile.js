var gulp = require('gulp');
var jshint = require('gulp-jshint');
var nodemon = require('gulp-nodemon');
var mocha = require('gulp-mocha');
var karma = require('karma').server;
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var uglifycss = require('gulp-uglifycss');

gulp.task('js', function() {
  return gulp.src(['./client/js/*.js', './client/js/*/*.js','./client/assets/snackbar/*.js'])
  .pipe(concat('all.js'))
  .pipe(uglify())
  .pipe(gulp.dest('./dist'));
});

gulp.task('css', function() {
  return gulp.src(['./client/assets/snackbar/*.css', './client/assets/styles/*.css'])
  .pipe(concat('all.css'))
  .pipe(uglifycss({
    "max-line-len": 80
  }))
  .pipe(gulp.dest('./dist'));
});

gulp.task('copy-files', function() {
  gulp.src(['./client/templates/*/*'])
  .pipe(gulp.dest('./dist/templates'));

  return gulp.src(['./client/assets/*'])
  .pipe(gulp.dest('./dist/assets'));
});

gulp.task('compress', ['js','css', 'copy-files']);

gulp.task('prep', [ 'compress'], function() {
  nodemon({ script: 'bin/www', ext: 'html js', /*ignore: ['ignored.js']*/ })
  .on('change', ['compress'])
  .on('restart', function() {
    console.log('restarted!')
  });
});

gulp.task('lint', function() {
  return gulp.src(['./*.js',
    './server/*.js',
    './client/js/*.js'
    ])
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('mocha', function() {
  return gulp.src('./tests/server/*.js', {read: false})
    .pipe(mocha())
    .once('end', function() {
      process.exit();
    });
});

gulp.task('mocha-test', function() {
  return gulp.src('./tests/server/*.js', {read: false})
    .pipe(mocha());
});

gulp.task('karma-test', function(done) {
  karma.start({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, done);
});

gulp.task('develop', ['lint', 'compress'], function() {
  nodemon({ script: 'bin/www', ext: 'html js', /*ignore: ['ignored.js']*/ })
    .on('change', ['lint', 'compress'])
    .on('restart', function() {
      console.log('restarted!')
    })
});

gulp.task('default', ['compress'], function() {
  // place code for your default task here
});
