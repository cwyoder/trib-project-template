const gulp = require('gulp');
const log = require('gulplog');

const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const cssnano = require('gulp-cssnano');

const browserify = require('browserify');
const uglify = require('gulp-uglify');
const babelify = require('babelify');
const sourcemaps = require('gulp-sourcemaps');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');

const nunjucksRender = require('gulp-nunjucks-render');
const context = require('./server/context');


gulp.task('sass', function(){
	log.info('Compiling scss ...');
	return gulp.src('sass/styles.scss')
		.pipe(sass({includePaths: [ 'sass/', 'node_modules/trib-styles/sass/' ]}))
		.pipe(autoprefixer({ cascade: false }))
		.pipe(cssnano())
		.pipe(gulp.dest('public/build'));
});

gulp.task('js', function() {
	const b = browserify({
		entries: './js/app.js',
		debug: true,
		transform: [babelify.configure({
		    // presets: ['es2015']
			presets: [['@babel/preset-env', {"targets": "defaults"}]]
		})]
	});
	log.info('Compiling Javascript ...');
	return b.bundle()
		.pipe(source('./js/app.js'))
		.pipe(buffer())
		.pipe(sourcemaps.init({loadMaps: true}))
			.pipe(uglify())
			.on('error', log.error)
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest('./public/build/'));
});

gulp.task('default', gulp.series('sass', 'js'));

gulp.task('watch', function(){
	log.info('Gulp is watching scss and js');
	gulp.watch('./sass/*.scss', gulp.series('sass'));
	gulp.watch('./js/*.js', gulp.series('js'));
});

gulp.task('render', function(){
	return gulp.src('templates/*.html')
		.pipe(nunjucksRender({
			path: ['templates/'],
			data: context
		}))
		.pipe(gulp.dest('public'));
});
