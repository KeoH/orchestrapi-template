let gulp = require("gulp");
let browserSync = require("browser-sync");
let sass = require("gulp-sass");
let prefix = require("gulp-autoprefixer");
let browserify = require("gulp-browserify");
let concat = require("gulp-concat");
let pug = require("gulp-pug");
let data = require("gulp-data");
var fs = require("fs");

gulp.task("sass", cb => {
  gulp
    .src("src/sass/main.sass")
    .pipe(sass({ outputStyle: "compressed" }))
    .pipe(prefix([">1%"], { cascade: false }))
    .pipe(gulp.dest("dist/css/"))
    .pipe(browserSync.reload({ stream: true }));
  cb();
});

gulp.task("browserify", cb => {
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

gulp.task("browser-sync", () => {
  browserSync({
    server: {
      baseDir: "./dist/"
    }
  });
});

gulp.task("pug", cb => {
  gulp
    .src("./src/pug/pages/*.pug")
    .pipe(
      data(function(file) {
        return JSON.parse(fs.readFileSync("./src/data.json"));
      })
    )
    .pipe(pug({}))
    .pipe(gulp.dest("dist/"))
    .pipe(browserSync.reload({ stream: true }));
  cb();
});

gulp.watch("src/sass/**/*.sass", gulp.series("sass"));
gulp.watch("src/js/**/*.js", gulp.series("browserify"));
gulp.watch("src/pug/**/*.pug", gulp.series("pug"));
gulp.watch("src/data.json", gulp.series("pug"));

exports.default = gulp.series("pug", "sass", "browserify", "browser-sync");
