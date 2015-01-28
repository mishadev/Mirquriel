// Node modules
var fs = require('fs'), vm = require('vm'), merge = require('deeply'), chalk = require('chalk'), es = require('event-stream');

// Gulp and plugins
var gulp = require('gulp'), rjs = require('gulp-requirejs-bundler'), concat = require('gulp-concat'), clean = require('gulp-clean'),
    replace = require('gulp-replace'), uglify = require('gulp-uglify'), htmlreplace = require('gulp-html-replace');

// Config
var requireJsRuntimeConfig = vm.runInNewContext(fs.readFileSync('src/app/require.config.js') + '; require;');
    requireJsOptimizerConfig = merge(requireJsRuntimeConfig, {
        out: 'scripts.js',
        baseUrl: './src',
        name: 'app/startup',
        paths: {
            requireLib: 'bower_modules/requirejs/require'
        },
        include: [
            'requireLib',
            'components/business-offer-page/business-offer',
            'components/contacts-page/contacts',
            'components/cooperation-offer-page/cooperation-offer',
            'components/loading/loading',
            'text!components/menu-bar/menu-bar.html'
        ],
        insertRequire: ['app/startup'],
        bundles: {
            // If you want parts of the site to load on demand, remove them from the 'include' list
            // above, and group them into bundles here.
            // 'bundle-name': [ 'some/module', 'another/module' ],
            // 'another-bundle-name': [ 'yet-another-module' ]
        }
    });

// Discovers all AMD dependencies, concatenates together all required .js files, minifies them
gulp.task('js', function () {
    return rjs(requireJsOptimizerConfig)
        .pipe(uglify({ preserveComments: 'some' }))
        .pipe(replace(/http:\/\/localhost:57071\//g, '/'))
        .pipe(gulp.dest('../Mirquriel.Web.Backend/'));
});

// Concatenates CSS files, rewrites relative paths to Bootstrap fonts, copies Bootstrap fonts
gulp.task('css', function () {
    var bowerCss = gulp.src('src/bower_modules/normalize.css/normalize.css'),
        appCss = gulp.src('src/css/*.css'),
        combinedCss = es.concat(bowerCss, appCss).pipe(concat('css.css'));

    return es.concat(combinedCss)
        .pipe(gulp.dest('../Mirquriel.Web.Backend/'));
});

// Copies index.html, replacing <script> and <link> tags to reference production URLs
gulp.task('html', function() {
    return gulp.src('./src/index.html')
        .pipe(htmlreplace({
            'css': 'css.css',
            'js': 'scripts.js'
        }))
        .pipe(gulp.dest('../Mirquriel.Web.Backend/'));
});

gulp.task('images', function () {
    var appImages = gulp.src('src/images/*.*');

    return es.concat(appImages)
        .pipe(gulp.dest('../Mirquriel.Web.Backend/images/'));
});

// Removes all files from ../Mirquriel.Web.Backend/
gulp.task('clean', function() {
    return gulp.src('../Mirquriel.Web.Backend/**/*', { read: false })
        .pipe(clean());
});

gulp.task('default', ['images', 'html', 'js', 'css'], function (callback) {
    callback();
    console.log('\nPlaced optimized files in ' + chalk.magenta('../Mirquriel.Web.Backend/\n'));
});
