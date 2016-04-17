// requires
var gulp = require('gulp');

// include plugins
var plugins = require('gulp-load-plugins')();
var gulpsync = require('gulp-sync')(gulp);
var del = require('del');
var critical = require('critical').stream;

// paths
var source = './src/';
var destination = './dist/';
var html = '/**/*.html';
var css = 'css/*.css';
var scss = 'css/**/*.scss';
var cssmin = 'css/styles.min.css';
var js = 'js/*.js';
var jsmin = 'js/global.min.js';
var img = '/**/*.{png,jpg,jpeg,gif,svg}';
var font = 'fonts/**/*.ttf';
var icon = 'fonts/icons/*.svg';

/* task "build" = "clean" + "html" + "css" + "js" + "img" + "woff" + "icon"
   ========================================================================== */

// task "clean" = del (destination)
gulp.task('clean', function() {
    return del(destination);
});

// task "html" = changed (source -> destination)
gulp.task('html', function() {
    return gulp.src(source + html)
        .pipe(plugins.changed(destination))
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
        .pipe(plugins.autoprefixer())
        .pipe(plugins.cssbeautify())
        .pipe(gulp.dest(destination + 'css/'));
});

// task "js" = changed (source -> destination)
gulp.task('js', function() {
    return gulp.src(source + js)
        .pipe(plugins.changed(destination + 'js/'))
        .pipe(gulp.dest(destination + 'js/'))
});

// task "img" = imagemin (source -> destination)
gulp.task('img', function() {
    return gulp.src([source + img, '!' + source + icon])
        .pipe(plugins.imagemin({
            progressive: true,
            interlaced: true,
            multipass: true
        }))
        .pipe(gulp.dest(destination));
});

// task "woff" = ttf2woff (source -> destination)
gulp.task('woff', function() {
    return gulp.src(source + font)
        .pipe(plugins.ttf2woff())
        .pipe(gulp.dest(destination + 'fonts/'))
});

// task "woff2" = ttf2woff2 (source -> destination)
gulp.task('woff2', function() {
    return gulp.src(source + font)
        .pipe(plugins.ttf2woff2())
        .pipe(gulp.dest(destination + 'fonts/'))
});

// task "icon" = icon (source -> destination)
gulp.task('icon', function() {
    return gulp.src(source + icon)
        .pipe(plugins.iconfont({
            fontName: 'icons',
            formats: ['woff', 'woff2'],
            fixedWidth: true,
            normalize: true,
            centerHorizontally: true,
            timestamp: Math.round(Date.now()/1000)
        }))
        .pipe(gulp.dest(destination + 'fonts/icons/'));
});

// task "build"
gulp.task('build', gulpsync.sync(['clean', ['html', 'css', 'js', 'img', 'woff', /*'woff2',*/ 'icon']]));

/* task "prod" = "build" + "url" + "cssmin" + "jsmin" + "critical" + "htmlmin" + "cleancss" + "cleanjs"
   ========================================================================== */

// task "url" = useref (destination -> destination)
gulp.task('url', function() {
    return gulp.src(destination + html)
        .pipe(plugins.useref())
		.pipe(gulp.dest(destination));
});

// task "cssmin" = uncss + csso (destination -> destination)
gulp.task('cssmin', function() {
    return gulp.src(destination + cssmin)
        .pipe(plugins.uncss({
            html: [destination + html]
		}))
        .pipe(plugins.csso())
        .pipe(gulp.dest(destination + 'css/'));
});

// task "jsmin" = uglify (destination -> destination)
gulp.task('jsmin', function() {
    return gulp.src(destination + jsmin)
        .pipe(plugins.uglify({
            output: {max_line_len: 400000}
		}))
        .pipe(gulp.dest(destination + 'js/'));
});

// task "critical" = critical (destination -> destination)
gulp.task('critical', function() {
    return gulp.src(destination + html)
        .pipe(critical({
            base: destination,
            inline: true,
            height: 640,
            minify: true
        }))
        .pipe(gulp.dest(destination));
});

// task "htmlmin" = htmlmin (destination -> destination)
gulp.task('htmlmin', function() {
    return gulp.src(destination + html)
        .pipe(plugins.htmlmin({
			removeComments: true,
			removeCommentsFromCDATA: true,
			removeCDATASectionsFromCDATA: true,
			collapseWhitespace: true,
			collapseBooleanAttributes: true,
			removeAttributeQuotes: true,
			removeRedundantAttributes: true,
			preventAttributesEscaping: true,
			useShortDoctype: true,
			removeEmptyAttributes: true,
			removeScriptTypeAttributes: true,
			removeStyleLinkTypeAttributes: true,
			removeOptionalTags: true,
			minifyURLs: true
		}))
        .pipe(gulp.dest(destination));
});

// task "cleancss" = del (destination -> destination)
gulp.task('cleancss', function() {
    return del([destination + css, '!' + destination + cssmin]);
});

// task "cleanjs" = del (destination -> destination)
gulp.task('cleanjs', function() {
    return del([destination + js, '!' + destination + jsmin]);
});

// task "prod"
gulp.task('prod', gulpsync.sync(['build', 'url', ['cssmin', 'jsmin'], 'critical', 'htmlmin', ['cleancss', 'cleanjs']]));

/* task "watch" = "css" + "html" + "js"
   ========================================================================== */

gulp.task('watch', function() {
    gulp.watch(source + scss, ['css']);
    gulp.watch(source + html, ['html']);
    gulp.watch(source + js, ['js']);
});

/* task "default" = "build"
   ========================================================================== */

gulp.task('default', ['build']);
