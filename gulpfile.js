// requires
var gulp = require('gulp');

// include plugins
var plugins = require('gulp-load-plugins')();
var run = require('run-sequence');
var browserify = require('browserify');
var babelify = require('babelify');
var stream = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');

// paths root
var source = './src/';
var destination = './dist/';

// paths files
var html = '**/*.html';
var scss = 'scss/**/*.+(scss|sass|css)';
var js = 'js/**/*.js';
var entry = 'js/main.js';
var images = 'img/**/*.+(png|jpg|jpeg|gif|svg)';
var fonts = 'fonts/**/*';
var cssmin = 'css/main.min.css';
var jsmin = 'js/main.min.js';

/* task "build" = ["html" + "css" + "eslint" + "js" + "img" + "fonts"]
   ========================================================================== */

// task "html" = (source -> destination)
gulp.task('html', function() {
    return gulp.src(source + html)
        .pipe(gulp.dest(destination))
});

// task "css" = sass + csscomb + autoprefixer + cssbeautify (source -> destination)
gulp.task('css', function() {
    return gulp.src(source + scss)
        .pipe(plugins.sass({
            errLogToConsole: true,
            outputStyle: 'expanded'
        })
        .on('error', plugins.sass.logError))
        .pipe(plugins.csscomb())
        .pipe(plugins.autoprefixer({
            browsers: ['> 1%', 'last 2 versions', 'Firefox ESR'],
            cascade: false
        }))
        .pipe(plugins.cssbeautify())
        .pipe(gulp.dest(destination + 'css/'))
});

// task "eslint" = eslint (source -> console)
gulp.task('eslint', function() {
    return gulp.src(source + js)
        .pipe(plugins.eslint({
            configFile: '.eslintrc'
        }))
        .pipe(plugins.eslint.format())
});

// task "js" = babel transpiler es6 to es5 (source -> destination)
gulp.task('js', function() {
    var bundler = browserify({
        entries: source + entry,
        debug: true,
        transform: [babelify.configure({
            presets: ['es2015'],
            plugins: ['transform-object-rest-spread']
        })]
    });
    bundler.bundle()
        .on('error', function (err) {})
        .pipe(stream('main.js'))
        .pipe(buffer())
        .pipe(gulp.dest(destination + 'js/'))
});

// task "img" = (source -> destination)
gulp.task('img', function() {
    return gulp.src(source + images)
        .pipe(gulp.dest(destination + 'img/'))
});

// task "fonts" = (source -> destination)
gulp.task('fonts', function() {
    return gulp.src(source + fonts)
        .pipe(gulp.dest(destination + 'fonts/'))
});

// task "build"
gulp.task('build', function(callback) {
    run(['html', 'css', 'eslint', 'js', 'img', 'fonts'], callback)
});

/* task "prod" = "url" + ["cssmin" + "jsmin" + "imgmin"]
   ========================================================================== */

// task "url" = useref (destination -> destination)
gulp.task('url', function() {
    return gulp.src(destination + html)
        .pipe(plugins.useref())
        .pipe(gulp.dest(destination))
});

// task "cssmin" = cssnano (destination -> destination)
gulp.task('cssmin', function() {
    return gulp.src(destination + cssmin)
        .pipe(plugins.cssnano())
        .pipe(gulp.dest(destination + 'css/'))
});

// task "jsmin" = uglify (destination -> destination)
gulp.task('jsmin', function() {
    return gulp.src(destination + jsmin)
        .pipe(plugins.uglify())
        .pipe(gulp.dest(destination + 'js/'))
});

// task "imgmin" = imagemin (destination -> destination)
gulp.task('imgmin', function() {
    return gulp.src(destination + images)
        .pipe(plugins.imagemin([
            plugins.imagemin.gifsicle({
                interlaced: true
            }),
            plugins.imagemin.jpegtran({
                progressive: true
            }),
            plugins.imagemin.svgo({plugins: [{
                removeUnknownsAndDefaults: false
            }]})
        ]))
        .pipe(gulp.dest(destination + 'img/'))
});

// task "prod"
gulp.task('prod', function(callback) {
    run('url', ['cssmin', 'jsmin', 'imgmin'], callback)
});

/* task "watch" = "css" + "html" + "js"
   ========================================================================== */

gulp.task('watch', function() {
    gulp.watch(source + html, ['html']);
    gulp.watch(source + scss, ['css']);
    gulp.watch(source + js, ['eslint', 'js']);
});

/* task "default" = "build"
   ========================================================================== */

gulp.task('default', ['build']);
