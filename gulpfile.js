/*
 * REQUIRES
 */
var gulp        = require('gulp');
var browserSync = require('browser-sync');
var sass        = require('gulp-sass');
var cleanCss    = require('gulp-clean-css');
var prefix      = require('gulp-autoprefixer');
var cp          = require('child_process');
var del         = require('del');
var imageMin    = require('gulp-imagemin');
var jpegTran    = require('imagemin-jpegtran');
var imageResize = require('gulp-image-resize');

/*********************************************************************************/

var jekyll   = process.platform === 'win32' ? 'jekyll.bat' : 'jekyll';
var messages = {
    jekyllBuild: 'DEV MODE: Building Jekyll Site\n<span style="color: grey">Running:</span> $ bundle exec jekyll build'
};

/**
 * Build the Jekyll Site
 */
gulp.task('jekyll-build', function (done){
    browserSync.notify(messages.jekyllBuild);
    return cp.spawn( jekyll , ['build'], {stdio: 'inherit'})
        .on('close', done);
});

/**
 * Build the Jekyll Site for Production
 */
// gulp.task('jekyll-live-build', function (done){
//     return cp.spawn(jekyll , ['build', '--config', '_liveConfig.yml'], {stdio: 'inherit'})
//         .on('close', done);
// });

/**
 * Rebuild Jekyll & do page reload
 */
gulp.task('jekyll-rebuild', ['jekyll-build'], function (){
    browserSync.reload();
});

/**
 * Wait for jekyll-build, then launch the Server
 */
gulp.task('browser-sync', ['sass', 'jekyll-build'], function(){
    browserSync({
        server: {
            baseDir: '_site'
        },
        notify: false,
        open: false
    });
});

/**
 * Compile files from assets/css/main.scss into both _site/css (for live injecting) and site (for future jekyll builds)
 */
gulp.task('sass', function (){
    return gulp.src('assets/css/main.scss')
        .pipe(sass({
            //includePaths: ['scss'],
            //onError: browserSync.notify
        }))
        .pipe(cleanCss({compatibility: 'ie8'})) //minify main.css
        .pipe(prefix(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
        .pipe(gulp.dest('_site/assets/css'))
        .pipe(browserSync.reload({stream:true}))
        .pipe(gulp.dest('assets/css'));
});

/**
 * Watch scss files for changes & recompile
 * Watch html/md files, run jekyll & reload BrowserSync
 */
gulp.task('watch', function (){
    gulp.watch('assets/css/**', ['sass']);
    gulp.watch(['*.html', '_layouts/**', '_includes/**', '_posts/*', 'assets/scripts/**'], ['jekyll-rebuild']);
});

/**
 * Grab data from Contentful in YAML format and place in _data folder
 */
gulp.task('contentful', function(done){
    return cp.spawn(jekyll , ['contentful'], {stdio: 'inherit'})
        .on('close', done);
});

/**
 * Process Contentful YAML data into markdown files in the _projects folder
 */
gulp.task('projects', ['contentful'], function(done){
    return cp.spawn('ruby' , ['./createProjects.rb'], {stdio: 'inherit'})
        .on('close', done);
});

/*
 * Calls the JS file as a child process to download all Contentful home page images
 * TODO: Change from using child process to using modeule exports - having issues with gulp not waiting for async
 * download to finish
 */

gulp.task('download-images', ['projects'], function(done){
    return cp.spawn('node' , ['./fetchContentfulImgs.js'], {stdio: 'inherit'})
        .on('close', done);
});

/*
 * Resize and minify downbloaded images for web. Needs download-images task to fully complete
 * TODO: Error checking:
 *         - YAML file from contentful exists
           - YAML file parsed correctly
           - ImageURL array contains 4 valid http URLs
           - Download destination exists and is writable
           - All 4 images are downloaded successfully
           - Resized images are all valid image files
           - Gulp task needs to fail of one of the above did not pass
 */
gulp.task('resize-images', ['download-images'], function(done){
    return gulp.src('./assets/images/home/download/*.jpg')
        .pipe(imageResize({
            width: 470,
            height: 470,
            crop: true,
            upscale: false
        }))
        .pipe(imageMin({
            progressive: true,
            use: [jpegTran()]
        }))
        .pipe(gulp.dest('./assets/images/home'));
});




/**
 * Default task, running just `gulp` will compile the sass,
 * compile the jekyll site, launch BrowserSync & watch files.
 */
gulp.task('default', ['browser-sync', 'watch']);
/**
 * task to run when building on Netlify (runs all tasks
 * appart from browser-sync)
 */
gulp.task('netlify-deploy', ['clean-site', 'sass', 'resize-images'], function(done){
    return cp.spawn(jekyll , ['build', '--config', '_liveConfig.yml'], {stdio: 'inherit'})
        .on('close', done);
});
/**
 * delete the _site folder
 */
gulp.task('clean-site', function(){
  return del.sync(['_site', '_data/contentful/**', '_projects/*', '!_projects/README.md', 'assets/images/home/download/*.jpg', 'assets/images/home/*.jpg']);
});
