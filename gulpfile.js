const autoprefixer = require("autoprefixer");
const browserSync = require("browser-sync");
const gulp = require("gulp");
const cache = require("gulp-cached");
const plumber = require("gulp-plumber");
const postcss = require("gulp-postcss");
const rename = require("gulp-rename");
const sass = require("gulp-sass")(require("sass"));
const sourcemaps = require("gulp-sourcemaps");
const rimraf = require("rimraf");
const fractal = require("@frctl/fractal");
const mandelbrot = require("@frctl/mandelbrot");

// 入出力ディレクトリ定義
// ==========================================================================

const dir = {
  src: "src",
  dist: "dist",
};

// watch: 更新ファイルの監視
// ==========================================================================

gulp.task("watch", () => {
  gulp.watch(`${dir.src}/**/*`, gulp.series("copy", "server-reload"));
  gulp.watch(
    `${dir.src}/**/scss/**/*.scss`,
    gulp.series("scss", "server-reload")
  );
});

// clean: 出力フォルダの削除
// ==========================================================================

gulp.task("clean", (done) => {
  rimraf(dir.dist, done);
});

// copy: スタティックファイルのコピー
// ==========================================================================

gulp.task("copy", (done) => {
  return gulp
    .src(`${dir.src}/**/*`, { base: dir.src })
    .pipe(plumber())
    .pipe(cache("copy"))
    .pipe(gulp.dest(dir.dist));
  // done();
});

// scss: Sassのコンパイル
// ==========================================================================

gulp.task("scss", (done) => {
  return gulp
    .src([`${dir.src}/**/scss/**/*.scss`], { base: dir.src })
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(
      sass({
        outputStyle: "compressed",
      })
    )
    .pipe(postcss([autoprefixer()]))
    .pipe(sourcemaps.write("./"))
    .pipe(
      rename((path) => {
        path.dirname = path.dirname.replace("scss", "css");
      })
    )
    .pipe(gulp.dest(dir.dist));
  // done();
});

// server: ローカルサーバーの起動
// ==========================================================================

gulp.task("server", (done) => {
  browserSync.init({
    server: { baseDir: dir.dist },
  });
  done();
});

// server-reload: ブラウザのリロード
// ==========================================================================

gulp.task("server-reload", (done) => {
  browserSync.reload();
  done();
});

// default: 起動時処理
// ==========================================================================

gulp.task(
  "default",
  gulp.series("clean", gulp.parallel("copy", "scss"), "server", "watch")
);
gulp.task("build", gulp.series("clean", gulp.parallel("copy", "scss")));
