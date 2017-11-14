const fs = require('fs-extra')
const config = require('./package.json')
const webfontsGenerator = require('webfonts-generator')

const concat = require('concat-files')

const CombinedStream = require('combined-stream')

const webfont = require('webfont').default

const testFolder = './library/icons'

const files = fs.readdirSync(testFolder)

const filepaths = files.map((filename) => {

  return `./library/icons/${filename}`

})


console.log('1. Generate Font')

webfont({
  files: filepaths,
  dest: './library/ficons-dist/fonts',
  cssTemplate: './library/templates/css.hbs',
  templateOptions: {
    classPrefix: 'fa-',
    baseSelector: '.fa'
  }
}, function (error) {
  if (error) {
    console.log('Fail!', error);
  } else {
    console.log('Done!');
  }
})
/*
webfontsGenerator({
  files: filepaths,
  dest: './library/ficons-dist/fonts',
  cssTemplate: './library/templates/css.hbs',
  templateOptions: {
    classPrefix: 'fa-',
    baseSelector: '.fa'
  }
}, function (error) {
  if (error) {
    console.log('Fail!', error);
  } else {
    console.log('Done!');
  }
})
*/

var basic = fs.readFileSync('./library/css/basic.css', { encoding: 'UTF-8' })

var find = '{{version}}';
var regularExpression = new RegExp(find, 'g');

basic = basic.replace(regularExpression, config.version);


var icons = fs.readFileSync('./library/css/iconfont.css')

fs.writeFileSync('./library/ficons-dist/css/ficons.css', basic + icons)

var destFontsDir = './library/ficons-dist/fonts'

if (fs.pathExists(destFontsDir)) {
  fs.removeSync(destFontsDir)
}

fs.copySync('./library/font', destFontsDir)


console.log('3. Upload To CDNJS and Update Version')
// research NPM to auto update and manage version
// get the CDNJS npm package and set up an account, make sure we can share it ... 

console.log('4. Update Website and Reference Materials')
// ...