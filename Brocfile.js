var concat = require('broccoli-concat'),  
    copy = require('broccoli-static-compiler'),
    sass = require('broccoli-sass-source-maps'),
    rev = require('broccoli-asset-rev'),
    merge = require('broccoli-merge-trees');

var babel = require('broccoli-babel-transpiler');
var browserify = require('broccolify');
var cssnano = require('broccoli-cssnano');
var uglify = require('broccoli-uglify-js');
var markdown = require('broccoli-md');

var nunjucks = require('./broccoli-nunjucks');


var env = require('broccoli-env').getEnv();

var js = babel('source/javascripts', {});

js = browserify(js, {
  entries: ['./main.js'],
  outputFile: 'assets/main.js'
  // browserify: {
  //   debug: true
  // }
});

var css = sass(['source/stylesheets', 
                'bower_components/bourbon/app/assets/stylesheets', 
                'bower_components/neat/app/assets/stylesheets',
                'bower_components/bootstrap-sass/assets/stylesheets'
               ], 
               'main.scss', 
               'assets/styles.css');  

var html = markdown('source/views');
html = nunjucks(html, {});
html = copy(html, {  
  srcDir: '.',
  destDir: '.'
});

var result;

switch(env) {
  case 'development':
    result = merge([js, css, html]);
  break;
  case 'production':
    css = cssnano(css);
    js = uglify(js);
    result = rev(merge([js, css, html]));
  break;
}

module.exports = result;