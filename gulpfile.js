const {src, dest, watch, parallel} = require("gulp");

// CSS
const sass = require("gulp-sass")(require("sass"));
const plumber = require('gulp-plumber'); // extraemos la depedencia
const autoprefixer = require('autoprefixer'); // Se asegura de q funcione en todos los navegadores
const cssnano = require('cssnano'); // Comprime nuestro código de css
const postcss = require('gulp-postcss'); // Realiza transformaciones por medio de 'autoprefixer' y 'cssnano'
const sourcemaps = require('gulp-sourcemaps');


// Imágenes
const cache = require('gulp-cache');
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');
const avif = require('gulp-avif');

// Javascript
const terser = require('gulp-terser-js');

function css(done) {
    src("src/scss/**/*.scss") // Identificar el archivo SASS
        .pipe(sourcemaps.init()) 
        .pipe(plumber())
        .pipe(sass()) // Compilarlo
        .pipe(postcss([ autoprefixer(), cssnano() ]))
        .pipe(sourcemaps.write('.'))
        .pipe(dest("build/css")) // Almacenarla en el disco duro

    done(); // Callback que avisa a gulp cuando llegamos al final de la ejecución de dicha función
}

function imagenes(done) {
    const opciones = {
        optimizationLevel: 3
    }
    src('src/img/**/*.{png,jpg}')
        .pipe(cache(imagemin(opciones)))
        .pipe(dest('build/img'))
    done();
}

function versionWebp(done) {
    const opciones = {
        quality: 50
    };
    src('src/img/**/*.{png,jpg}')
        .pipe(webp(opciones))
        .pipe(dest('build/img'))
    done();
}

function versionAvif(done) {
    const opciones = {
        quality: 50
    };
    src('src/img/**/*.{png,jpg}')
        .pipe(avif(opciones))
        .pipe(dest('build/img'))
    done();
}

function javascript(done) {
    src('src/js/**/*.js')
        .pipe(sourcemaps.init())
        .pipe(terser())
        .pipe(sourcemaps.write('.'))
        .pipe(dest('build/js'));

    done();
}

function dev(done) {
    watch("src/scss/**/*.scss", css)
    watch("src/js/**/*.js", javascript)

    done();
}

exports.css = css; // Llama la función de 'css' 
exports.js = javascript; 
exports.imagenes = imagenes;
exports.versionWebp = versionWebp;
exports.versionAvif = versionAvif;
exports.dev = parallel(imagenes, versionWebp, versionAvif, javascript, dev);