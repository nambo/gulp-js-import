'use strict'
const gutil = require('gulp-util')
const through = require('through2')
const fs = require('fs')

function clean_path(path) {

  path = path.replace(/\\/g, '/');

  let prev_folder_count = path.match(/..\//g).length;

  let folder_array = path.split("/");

  for (let i = 0; prev_folder_count > i; i++)
    folder_array.forEach(function (element, index, array) {
      if (element == '..') {
        array.splice(index, 1);
        array.splice(index - 1, 1);
      }
    });

  // path = path.replace(/.\//g, '');

  return folder_array.join('/');
}

module.exports = function (options) {
  options = options || {};
  let importStack = []
  const importJS = (path) => {
    if (!path) {
      return ''
    }

    let fileReg;
    if (options.es6import) {
      fileReg = /\n *import\s["'](.*\.js)["']/gi
    } else {
      fileReg = /\n *@import\s["'](.*\.js)["']/gi
    }

    if (!fs.existsSync(path)) {
      throw new Error('file ' + path + ' no exist')
    }

    let content = fs.readFileSync(path, {
      encoding: 'utf8'
    })

    content = content.replace(fileReg, (match, fileName) => {
      let importPath = path.replace(/[^\\^\/]*\.js$/, fileName)

      if (options.importStack) {
        if (importStack.includes(clean_path(importPath))) {
          !options.hideConsole && console.log('file: ' + importPath + 'was imported do not import it again')
          return ''
        }
      }

      importStack.push(clean_path(importPath))

      !options.hideConsole && console.log('import "' + fileName + '" --> "' + path + '"')

      let importContent = importJS(importPath) || ''

      return importContent
    })

    return content
  }

  return through.obj(function (file, enc, cb) {
    if (file.isNull()) {
      cb(null, file)
      return
    }

    if (file.isStream()) {
      cb(new gutil.PluginError('gulp-js-import', 'Streaming not supported'))
      return
    }

    let content
    try {
      content = importJS(file.path)
      // reset stack when everysingle file has finished
      importStack = [];
    } catch (e) {
      cb(new gutil.PluginError('gulp-js-import', e.message))
      return
    }

    file.contents = new Buffer(content)
    file.path = gutil.replaceExtension(file.path, '.js')
    !options.hideConsole && console.log('ImportJS finished.')
    cb(null, file)
  })
}