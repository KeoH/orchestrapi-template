let gulp = require("gulp");
let browserSync = require("browser-sync");
let sass = require("gulp-sass");
let prefix = require("gulp-autoprefixer");
let gutil = require("gulp-util");
let browserify = require("gulp-browserify");
let concat = require("gulp-concat");
let hb = require("gulp-hb");

gulp.task("sass", (cb) => {
  gulp
    .src("src/sass/main.sass")
    .pipe(sass({ outputStyle: "compressed" }))
    .pipe(prefix([">1%"], { cascade: false }))
    .pipe(gulp.dest("dist/css/"))
    .pipe(browserSync.reload({ stream: true }));
  cb();
});

gulp.task("browserify", (cb) => {
  gulp
    .src(["src/js/main.js"])
    .pipe(
      browserify({
        insertGlobals: true,
        debug: true
      })
    )
    .pipe(concat("main.js"))
    .pipe(gulp.dest("dist/js/"))
    .pipe(browserSync.reload({ stream: true }));
  cb();
});

gulp.task("browser-sync", (cb) => {
  browserSync({
    server: {
      baseDir: "./dist/"
    }
  });
});

gulp.task("html", (cb) => {
  gulp
    .src("./src/**/*.html")
    .pipe(gulp.dest("dist/"))
    .pipe(browserSync.reload({ stream: true }));
  cb();
});

gulp.task("hbs", (cb) => {
  gulp
    .src("./src/hbs/templates/**/*.html")
    .pipe(
      hb({
        partials: "./src/hbs/partials/**/*.hbs",
        helpers: "./src/hbs/helpers/*.js",
        data: "./src/hbs/data/**/*.{js,json}"
      })
    )
    .pipe(gulp.dest("./dist"));
  cb();
});


gulp.watch("src/sass/**/*.sass", gulp.series("sass"));
gulp.watch("src/js/**/*.js", gulp.series("browserify"));
gulp.watch("src/hbs/templates/*.html", gulp.series("hbs", "html"));
gulp.watch("src/**/*.hbs", gulp.series("hbs", "html"));



exports.default = gulp.series("hbs", "browser-sync", "sass", "browserify")