const gulp = require('gulp');
const util = require('gulp-util');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const cssnano = require('gulp-cssnano');
const browserify = require('browserify');
const babelify = require('babelify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const uglify = require('gulp-uglify');
const stylelint = require('gulp-stylelint');
const eslint = require('gulp-eslint');
const sourcemaps = require('gulp-sourcemaps');
const imagemin = require('gulp-imagemin');

/* config
 ========================================================================== */

// paths
const paths = {
  entry: './src/assets/',
  output: './dist/',
  app: 'scripts/main.js',
  styles: 'styles/**/*.+(scss|sass|css)',
  scripts: 'scripts/**/*.js',
  images: 'images/**/*.+(png|jpg|jpeg|gif|svg)',
  fonts: 'fonts/**/*.+(eot|svg|ttf|woff|woff2)'
};

// environments
const production = !!util.env.env;

/* linters (stylelint, eslint)
 ========================================================================== */

// task 'stylelint'
gulp.task('stylelint', () =>
  gulp.src(paths.entry + paths.styles)
    .pipe(stylelint({
      reporters: [{
        formatter: 'string',
        console: true
      }]
    }))
);

// task 'eslint'
gulp.task('eslint', () =>
  gulp.src(paths.entry + paths.scripts)
    .pipe(eslint({
      configFile: '.eslintrc.json'
    }))
    .pipe(eslint.format())
);

/* build (css, js, images, fonts)
 ========================================================================== */

// task 'css'
gulp.task('css', ['stylelint'], () =>
  gulp.src(paths.entry + paths.styles)
    .pipe(sourcemaps.init())
    .pipe(sass({
      outputStyle: 'expanded'
    }).on('error', sass.logError))
    .pipe(autoprefixer({
      cascade: false
    }))
    .pipe(production ? cssnano() : util.noop())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(paths.output + 'css/'))
);

// task 'js'
gulp.task('js', ['eslint'], () => {
  browserify({
      entries: paths.entry + paths.app,
      debug: true
    })
    .transform('babelify')
    .bundle()
    .on('error', err => {
      console.error(`${err.message}${err.codeFrame}`)
    })
    .pipe(source('main.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({
      loadMaps: true
    }))
    .pipe(production ? uglify() : util.noop())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(paths.output + 'js/'))
});

// task 'images'
gulp.task('images', () =>
  gulp.src(paths.entry + paths.images)
    .pipe(production ? imagemin([
      imagemin.gifsicle({
        interlaced: true
      }),
      imagemin.jpegtran({
        progressive: true
      }),
      imagemin.svgo({
        plugins: [{
          removeUnknownsAndDefaults: false
        }]
      })
    ]) : util.noop())
    .pipe(gulp.dest(paths.output + 'images/'))
);

// task 'fonts'
gulp.task('fonts', () =>
  gulp.src(paths.entry + paths.fonts)
    .pipe(gulp.dest(paths.output + 'fonts/'))
);

// build
gulp.task('build', ['css', 'js', 'images', 'fonts']);

/* watch (css, js)
 ========================================================================== */

gulp.task('watch', () => {
  gulp.watch(paths.entry + paths.styles, ['css']);
  gulp.watch(paths.entry + paths.scripts, ['js']);
});

/* default (build)
 ========================================================================== */

gulp.task('default', ['build']);
