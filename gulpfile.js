var gulp = require("gulp");
var react = require("gulp-react");
var concat = require("gulp-concat");
gulp.task("default", function () {
  return gulp
    .src("components/**")
    .pipe(concat("singlefile.js"))
    .pipe(react())
    .pipe(gulp.dest("dist"));
});
