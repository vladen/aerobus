var gulp = require('gulp');

gulp.task('lint', function() {
	var eslint = require('gulp-eslint');
	gulp.src(['./aerobus.js']).pipe(eslint()).pipe(eslint.format());
});

gulp.task('test', function() {
	gulp.src('./test/aerobus.js', {read: false}).pipe(require('gulp-mocha')({
		reporter: 'spec'
	}).once('error', function () {
		process.exit(1);
	}));
});