const config = require("./package.json")

const fs = require("fs-extra")
const CleanCSS = require("clean-css")

const chalk = require("chalk")

const ficonsWebfontsGenerator = require("ficons-webfont-generator")

// mapping the icons
const fontName = "ficons"
const standardName = "iconfont"
const originalIcons = "./original"
const srcFolder = "./src"
const distFolder = "./dist"
const outputFolder = `${distFolder}/${fontName}`
const iconsFolder = `${srcFolder}/${fontName}`
const readmeFile = `./README.md`
const basicCSSFile = `./tpl/basic.css`
const jsonFile = `${outputFolder}/font.config.json`

const generatedIconsCSSFile = `${outputFolder}/partial.icons.css`

const originalFiles = fs.readdirSync(originalIcons)
const ficonFiles = fs.readdirSync(iconsFolder)

const iconsListing = {
  new: [],
  replaced: [],
  original: [],
  brands: require("./tpl/brands.js").sort(),
  assistive: require("./tpl/assistive.js").sort(),
  currency: require("./tpl/currency.js").sort(),
  ignore: require("./tpl/ignore.js")
}

const filepaths = originalFiles.map(filename => {
  let name = filename.replace(".svg", "")
  if (ficonFiles.includes(filename)) {
    iconsListing.replaced.push(name)
    return `${iconsFolder}/${filename}`
  } else {
    if (
      !iconsListing.brands.includes(name) &&
      !iconsListing.assistive.includes(name) &&
      !iconsListing.currency.includes(name)
    ) {
      iconsListing.original.push(name)
    }

    return `${originalIcons}/${filename}`
  }
})

ficonFiles.forEach(filename => {
  let name = filename.replace(".svg", "")
  if (!originalFiles.includes(filename)) {
    iconsListing.new.push(filename.replace(".svg", ""))
    filepaths.unshift(`${iconsFolder}/${filename}`)
  }
})

// creating the fonts

console.log("Making Font...")
ficonsWebfontsGenerator(
  {
    fontName: standardName,
    files: filepaths,
    dest: outputFolder,
    cssDest: generatedIconsCSSFile,
    cssTemplate: "./tpl/css.hbs",
    html: true,
    htmlDest: `${outputFolder}/preview.html`,
    htmlTemplate: "./tpl/html.hbs",
    json: true,
    jsonDest: jsonFile,
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

      // ADD CONFIG TO JSON
      var jsonConfig = fs.readJsonSync(jsonFile)
      jsonConfig.listing = iconsListing

      // prettier-ignore
      jsonConfig.cdn = `https://cdn.jsdelivr.net/npm/ficons@${config.version}/dist/${fontName}/font.css`
      // prettier-ignore
      jsonConfig.cdnDev = `https://cdn.jsdelivr.net/npm/ficons/dist/${fontName}/font.css`

      jsonConfig.cssFile = `/dist/${fontName}/font.css`

      fs.writeJsonSync(jsonFile, jsonConfig)

      // ADD VERSION NUMBER - Add Cache Busting TO Font Files
      let find = "{{version}}"
      let regularExpression = new RegExp(find, "g")
      basic = basic.replace(regularExpression, config.version)

      var readme = fs.readFileSync(readmeFile, {
        encoding: "UTF-8"
      })
      readme = readme.replace(/(\d+\.)(\d+\.)(\d{0,3})/, config.version)
      fs.writeFileSync(readmeFile, readme)

      // ADD FONT NAME
      find = "{{fontName}}"
      regularExpression = new RegExp(find, "g")
      basic = basic.replace(regularExpression, standardName)

      // reading and concatenate the basic.css & basic.css into ficons.css

      var icons = fs.readFileSync(generatedIconsCSSFile)

      var rawCSS = `${basic} \n\n ${icons}`
      fs.ensureFileSync(`${outputFolder}/font.css`)
      fs.writeFileSync(`${outputFolder}/font.css`, rawCSS)

      fs.ensureFileSync(`${outputFolder}/partial.basic.css`)
      fs.writeFileSync(`${outputFolder}/partial.basic.css`, basic)

      fs.ensureFileSync(`${outputFolder}/font.min.css`)
      fs.writeFileSync(
        `${outputFolder}/font.min.css`,
        new CleanCSS().minify(rawCSS)
      )

      console.log(chalk.hex("#0496FF").bold("Done Writing Files!"))
    }
  }
)
