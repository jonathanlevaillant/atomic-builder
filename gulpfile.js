const gulp = require('gulp');
const sass = require('gulp-sass')(require('node-sass'));
const autoprefixer = require('gulp-autoprefixer');
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

/* linters (stylelint)
 ========================================================================== */

// task 'stylelint'
gulp.task('stylelint', () =>
  gulp.src(`${paths.entry}${paths.styles}`)
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
gulp.task('demo', gulp.series('stylelint', () =>
  gulp.src(`${demoPaths.entry}${demoPaths.styles}`)
    .pipe(sourcemaps.init())
    .pipe(sass({
      importer: tildeImporter,
      outputStyle: 'expanded',
    }).on('error', sass.logError))
    .pipe(autoprefixer({
      cascade: false,
    }))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(demoPaths.output))
));

/* build (css)
 ========================================================================== */

// task 'css'
gulp.task('css', gulp.series('stylelint', () =>
  gulp.src(`${paths.entry}${paths.styles}`)
    .pipe(sourcemaps.init())
    .pipe(sass({
      importer: tildeImporter,
      outputStyle: 'expanded',
    }).on('error', sass.logError))
    .pipe(autoprefixer({
      cascade: false,
    }))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(paths.output))
));

// task 'build'
gulp.task('build', gulp.series('css'));

/* watch (css, demo)
 ========================================================================== */

gulp.task('watch', () => {
  gulp.watch(`${paths.entry}${paths.styles}`, gulp.series('css', 'demo'));
  gulp.watch(`${demoPaths.entry}${demoPaths.styles}`, gulp.series('demo'));
});

/* default (build)
 ========================================================================== */

gulp.task('default', gulp.series('build'));
