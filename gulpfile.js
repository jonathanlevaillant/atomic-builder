// requires
var gulp = require('gulp');

// include plugins
var plugins = require('gulp-load-plugins')();
var run = require('run-sequence');

// paths root
var source = './src/';
var destination = './dist/';

// paths files
var html = '**/*.html';
var scss = 'scss/**/*.+(scss|sass|css)';
var js = 'js/**/*.js';
var images = 'img/**/*.+(png|jpg|jpeg|gif|svg)';
var fonts = 'fonts/**/*';
var cssmin = 'css/main.min.css';
var jsmin = 'js/global.min.js';

/* task "build" = ["html" + "css" + "js" + "img" + "fonts"]
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

// task "js" = changed (source -> destination)
gulp.task('js', function() {
    return gulp.src(source + js)
        .pipe(plugins.changed(destination + 'js/'))
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
    run(['html', 'css', 'js', 'img', 'fonts'], callback)
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
        .pipe(plugins.uglify({
            output: {max_line_len: 1000000}
        }))
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
    gulp.watch(source + js, ['js']);
});

/* task "default" = "build"
   ========================================================================== */

gulp.task('default', ['build']);
