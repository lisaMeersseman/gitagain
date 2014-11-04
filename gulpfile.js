var gulp 		= require('gulp'),
	header 		= require('gulp-header'),
	browserify 	= require('browserify'),
	source 		= require('vinyl-source-stream'),
	gutil 		= require('gulp-util'),
	jshint 		= require('gulp-jshint'),
	uglify 		= require('gulp-uglify'),
	buffer 		= require('gulp-buffer'),
	sourcemaps	= require('gulp-sourcemaps'),
	compass 	= require('gulp-compass');

var pkg 		= require('./package.json');

gulp.task('default', ['jsScripts','cssScripts'], function (){
	var jsWatcher = gulp.watch('dashboard/js/**/*.js', ['jsScripts']);
	jsWatcher.on('change', function(event) {
		console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
	});

	cssWatcher = gulp.watch('dashboard/_scss/*.scss', ['cssScripts'])
	cssWatcher.on('change', function(event) {
		console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
	});
});

gulp.task('jsScripts', ['lint'], function(){

	var bundler = browserify({
		entries: ['./dashboard/js/agenda/script.js'], debug:true
	});

	return bundler.bundle()
		.on('error', function(err) { 
			this.emit('end');
			gutil.log('Error:', gutil.colors.red(err.message));
			gutil.beep();
		})
		.pipe(source('calendar.dist.js'))
		.pipe(buffer())
		.pipe(sourcemaps.init({loadMaps:true}))
		.pipe(uglify())
		.pipe(sourcemaps.write('./', {
			sourceRoot: '../'
		}))
		.pipe(gulp.dest('./dashboard/js_dist/'))
});

gulp.task('lint', function(cb) {
  return gulp.src(['./dashboard/js/agenda/**/*.js', '!./dashboard/js/vendor/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
    cb();
});

gulp.task('cssScripts', function (){
	return gulp.src('_scss/*.scss')
	.pipe(compass({
		config_file: './dashboard/config.rb',
		css: 'css',
		sass: '_scss'
	}))
	.pipe(gulp.dest('./dashboard/css/'));	
});
