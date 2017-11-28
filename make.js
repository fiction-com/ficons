const config = require("./package.json")

const fs = require("fs-extra")
const CleanCSS = require("clean-css")

const chalk = require("chalk")

const ficonsWebfontsGenerator = require("ficons-webfont-generator")

// mapping the icons
const fontName = "ficons"

const originalIcons = "./original"
const srcFolder = "./src"
const distFolder = "./dist"

const basicCSSFile = `./tpl/basic.css`

const outputFolder = `${distFolder}/${fontName}`
const iconsFolder = `${srcFolder}/${fontName}`

const generatedIconsCSSFile = `${outputFolder}/partial.icons.css`

const originalFiles = fs.readdirSync(originalIcons)
const ficonFiles = fs.readdirSync(iconsFolder)

const filepaths = originalFiles.map(filename => {
  if (ficonFiles.includes(filename)) {
    return `${iconsFolder}/${filename}`
  } else {
    return `${originalIcons}/${filename}`
  }
})

ficonFiles.forEach(filename => {
  if (!originalFiles.includes(filename)) {
    filepaths.unshift(`${iconsFolder}/${filename}`)
  }
})

// creating the fonts

console.log("Making Font...")
ficonsWebfontsGenerator(
  {
    fontName: fontName,
    files: filepaths,
    dest: outputFolder,
    cssDest: generatedIconsCSSFile,
    cssTemplate: "./tpl/css.hbs",
    html: true,
    htmlDest: `${outputFolder}/preview.html`,
    htmlTemplate: "./tpl/html.hbs",
    json: true,
    jsonDest: `${outputFolder}/font.config.json`,
    templateOptions: {
      classPrefix: "fa-",
      baseSelector: ".fa"
    },
    descent: "256"
  },
  function(error) {
    if (error) {
      console.log("Fail!", error)
    } else {
      console.log(chalk.hex("#0496FF").bold("Done Making Font!"))

      console.log("Writing Files...")
      var basic = fs.readFileSync(basicCSSFile, {
        encoding: "UTF-8"
      })

      // ADD VERSION NUMBER - Add Cache Busting TO Font Files
      let find = "{{version}}"
      let regularExpression = new RegExp(find, "g")
      basic = basic.replace(regularExpression, config.version)

      // ADD FONT NAME
      find = "{{fontName}}"
      regularExpression = new RegExp(find, "g")
      basic = basic.replace(regularExpression, fontName)

      // reading and concatenate the basic.css & basic.css into ficons.css

      var icons = fs.readFileSync(generatedIconsCSSFile)

      var rawCSS = `${basic} \n\n ${icons}`
      fs.ensureFileSync(`${outputFolder}/font.css`)
      fs.writeFileSync(`${outputFolder}/font.css`, rawCSS)

      fs.ensureFileSync(`${outputFolder}/partial.basic.css`)
      fs.writeFileSync(`${outputFolder}/partial.basic.css`, basic)

      fs.ensureFileSync(`${outputFolder}/ficons.min.css`)
      fs.writeFileSync(
        `${outputFolder}/ficons.min.css`,
        new CleanCSS().minify(rawCSS)
      )

      console.log(chalk.hex("#0496FF").bold("Done Writing Files!"))
    }
  }
)
