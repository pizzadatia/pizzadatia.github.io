const gulp = require('gulp');
const nunjucks = require('nunjucks');
const gulpNunjucks = require('gulp-nunjucks');
const sourcemaps = require('gulp-sourcemaps');
const sass = require('gulp-sass');
const purify = require('gulp-purifycss');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const browserSync = require('browser-sync').create();


const latinFix = str => new nunjucks.runtime.SafeString(str
  .replace(/á/g, '<span class="char-acute">a</span>')
  .replace(/Á/g, '<span class="char-acute">A</span>')
  .replace(/É/g, '<span class="char-acute">E</span>')
  .replace(/é/g, '<span class="char-acute">e</span>')
  .replace(/í/g, '<span class="char-acute">i</span>')
  .replace(/Í/g, '<span class="char-acute">I</span>')
  .replace(/ó/g, '<span class="char-acute">o</span>')
  .replace(/Ó/g, '<span class="char-acute">O</span>')
  .replace(/ú/g, '<span class="char-acute">u</span>')
  .replace(/Ú/g, '<span class="char-acute">U</span>')
  .replace(/â/g, '<span class="char-grave">a</span>')
  .replace(/ê/g, '<span class="char-grave">e</span>')
  .replace(/ô/g, '<span class="char-grave">o</span>')
  .replace(/ã/g, '<span class="char-tilde">a</span>')
  .replace(/õ/g, '<span class="char-tilde">o</span>')
);

/** HTML */
const htmlTask = 'html';
const htmlSrc = './src/**/*.{html,njk}';
const htmlPages = './src/pages/*.html';
const htmlDest = './';
const templateDir = './src/templates';
const contentSrc = './content.json';

gulp.task(htmlTask, () => {
  delete require.cache[require.resolve(contentSrc)];
  const templateData = require(contentSrc);
  const templateLoader = new nunjucks.FileSystemLoader([templateDir, styleDest]);
  const templateEnv = new nunjucks.Environment(templateLoader);
  templateEnv.addFilter('latinFix', latinFix);

  return gulp.src(htmlPages)
    .pipe(gulpNunjucks.compile(templateData, {
       env: templateEnv
     }))
    .pipe(gulp.dest(htmlDest))
    .pipe(browserSync.stream())
});

/** Styles */
const styleTask = 'style';
const styleSrc = './src/style/*.scss';
const styleDest = './dist';

gulp.task(styleTask, () => gulp.src(styleSrc)
  .pipe(sourcemaps.init())
  .pipe(sass().on('error', sass.logError))
  .pipe(purify(['./*.html']))
  .pipe(postcss([
    cssnano,
    autoprefixer({browsers: ['last 2 versions']}),
  ]))
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest(styleDest))
  .pipe(browserSync.stream())
);

/** Main tasks */
gulp.task('watch', () => {
  browserSync.init({
    server: {
      baseDir: './',
    },
  });

  gulp.watch([contentSrc, htmlSrc], [htmlTask]);
  gulp.watch(styleSrc, [styleTask]);
});

gulp.task('default', [htmlTask, styleTask]);
