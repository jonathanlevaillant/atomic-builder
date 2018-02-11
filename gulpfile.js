const gulp = require('gulp');
const util = require('gulp-util');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const cssnano = require('gulp-cssnano');
const stylelint = require('gulp-stylelint');
const sourcemaps = require('gulp-sourcemaps');
const tildeImporter = require('node-sass-tilde-importer');

/* config
 ========================================================================== */

// paths
const paths = {
  entry: 'src/',
  output: 'dist/',
  styles: '**/*.+(scss|sass|css)',
};

// demo paths
const demoPaths = {
  entry: 'demo/src/',
  output: 'demo/dist/',
  styles: '**/*.+(scss|sass|css)',
};

// environments
const production = !!util.env.env;

/* linters (stylelint)
 ========================================================================== */

// task 'stylelint'
gulp.task('stylelint', () =>
  gulp.src(paths.entry + paths.styles)
    .pipe(stylelint({
      reporters: [{
        formatter: 'string',
        console: true,
      }],
    }))
);

/* demo
 ========================================================================== */

// task 'demo'
gulp.task('demo', ['stylelint'], () =>
  gulp.src(demoPaths.entry + demoPaths.styles)
    .pipe(sourcemaps.init())
    .pipe(sass({
      importer: tildeImporter,
      outputStyle: 'expanded',
    }).on('error', sass.logError))
    .pipe(autoprefixer({
      cascade: false,
    }))
    .pipe(production ? cssnano() : util.noop())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(demoPaths.output))
);

/* build (css)
 ========================================================================== */

// task 'css'
gulp.task('css', ['stylelint'], () =>
  gulp.src(paths.entry + paths.styles)
    .pipe(sourcemaps.init())
    .pipe(sass({
      importer: tildeImporter,
      outputStyle: 'expanded',
    }).on('error', sass.logError))
    .pipe(autoprefixer({
      cascade: false,
    }))
    .pipe(production ? cssnano() : util.noop())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(paths.output))
);

// task 'build'
gulp.task('build', ['css']);

/* watch (css, demo)
 ========================================================================== */

gulp.task('watch', () => {
  gulp.watch(paths.entry + paths.styles, ['css', 'demo']);
  gulp.watch(demoPaths.entry + demoPaths.styles, ['demo']);
});

/* default (build)
 ========================================================================== */

gulp.task('default', ['build']);
