const gulp = require("gulp")
const plumber = require("gulp-plumber")
const notify = require("gulp-notify")
const sass = require("gulp-sass")
const postcss = require("gulp-postcss")
const autoprefixer = require("autoprefixer")
const pug = require("gulp-pug")
const data = require("gulp-data")
const fs = require("fs")
const browserSync = require("browser-sync").create()
const browserReload = (done) => {
  browserSync.reload()
  done()
}

const pugData = function(){
  return JSON.parse(fs.readFileSync("./src/pug/data.json", "utf8"))
}

gulp.task("pug", () => {
  return gulp.src("src/pug/**.pug")
    .pipe(data(pugData))
    .pipe(pug())
    .pipe(gulp.dest("./dist"))
})

const postcssPlugins = [ autoprefixer ]

const plumberOption = {
  errorHandler: notify.onError("Error: <%= error.message %>")
}

gulp.task("sass", () => {
  return gulp.src("src/sass/main.scss")
    .pipe(plumber(plumberOption))
    .pipe(sass())
    .pipe(postcss(postcssPlugins))
    .pipe(gulp.dest("./dist"))
})

const browserSyncOption = {
  server: "./dist"
}

gulp.task("serve", (done) => {
  browserSync.init(browserSyncOption)
  done()
})

gulp.task("watch", (done) => {
  const browserReload = (done) => {
    browserSync.reload()
    done()
  }
  gulp.watch("./src/**/*.pug", gulp.parallel("pug"))
  gulp.watch("./src/**/*.scss", gulp.parallel("sass"))
  gulp.watch(["./dist/*.html", "./dist/*.css"], browserReload)
})

gulp.task("default", gulp.series(
  gulp.parallel("pug", "sass"),
  "serve",
  "watch"
))
