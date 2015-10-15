var assign = require('object-assign');
var Filter = require('broccoli-filter');
var nunjucks = require('nunjucks');

function NunjucksFilter(inputTree, options) {
  if (!(this instanceof NunjucksFilter)) {
    return new NunjucksFilter(inputTree, options);
  }

  this.inputTree = inputTree;
  this.options = options || {};
}

NunjucksFilter.prototype = Object.create(Filter.prototype);
NunjucksFilter.prototype.constructor = NunjucksFilter;

NunjucksFilter.prototype.extensions = ['html'];
NunjucksFilter.prototype.targetExtension = 'html';

NunjucksFilter.prototype.processString = function (str, relativePath) {
  nunjucks.configure('source/templates');
  
  var opts = assign({}, this.options);
  opts.name = typeof this.options.name === 'function' && this.options.name(relativePath) || relativePath;
  return nunjucks.renderString(str, opts);
};

module.exports = NunjucksFilter;