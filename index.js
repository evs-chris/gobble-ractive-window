var esperanto = require('esperanto'),
    to5 = require('6to5'),
    path = require('path');

module.exports = ractiveWindow;

var scriptsRE = /<script ?[^>]*>([^]+)<\/script>/mi,
    noop = function() {},
    cache = (function() {
      var cache = {};
      return function(file) {
        var ver = cache[file];
        if (ver === undefined) {
          cache[file] = ver = 0;
        } else {
          cache[file] = ++ver;
        }
        return file + '-' + ver;
      };
    })();

function ractiveWindow(code, options) {
  var html = code, m = true, scripts = [], opts = options || {}, template, script, result;
  var Ractive = options.Ractive;
  if (typeof options.loadRactive === 'function') {
    Ractive = options.loadRactive();
  }
  var log = this.log || noop;

  var esperantoOpts = opts.esperanto || { strict: true };
  var to5Opts = opts['6to5'] || opts._6to5 || opts.to5 || {};

  if (Array.isArray(to5Opts.blacklist)) {
    to5Opts.blacklist.push('useStrict', 'modules');
  } else {
    to5Opts.blacklist = ['useStrict', 'modules'];
  }

  if (!Ractive) throw new Error('Please provide the Ractive with which you wish to parse your templates.');

  log(this.filename + ' - splitting');
  while (!!m) {
    m = scriptsRE.exec(html);

    if (!!m) {
      html = html.slice(0, m.index) + html.slice(m.index + m[0].length);
      scripts.push(m[1]);
    }
  }

  log(this.filename + ' - compiling');
  script = scripts.join('\n');
  script = to5.transform(script, to5Opts).code;
  script = esperanto.toCjs(script, esperantoOpts).code;

  template = Ractive.parse(html);

  result = 'return {\n\n' +
    'template: ' + JSON.stringify(template.t) + ',\n' +
    'partials: ' + JSON.stringify(template.p) + ',\n\n' +
    'fn: function(require) {\nvar global = this,\n    me = this,\n    module = { exports: {} };\n\n//---- Your code begins here ----\n' + script + '\n//---- Your code ends here ----\n\n' +
    'return module.exports;\n' +
    '}\n\n' +
  '}';

  if (opts.addSourceUrl !== false) {
    if (this.env === 'development') {
      result += '\n//# sourceURL=' + (opts.prefix || '/') + cache(this.filename);
    } else {
      result += '\n//# sourceURL=' + (opts.prefix || '/') + this.filename;
    }
  }

  return result;
}

ractiveWindow.defaults = {
  accept: /\.rw\.html$/
};
