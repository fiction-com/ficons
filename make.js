const config = require("./package.json")

const fs = require("fs-extra")
const CleanCSS = require("clean-css")

const chalk = require("chalk")

const ficonsWebfontsGenerator = require("ficons-webfont-generator")

// mapping the icons

const originalIcons = "./original"
const ficons = "./src"

const originalFiles = fs.readdirSync(originalIcons)
const ficonFiles = fs.readdirSync(ficons)

const filepaths = originalFiles.map(filename => {
  if (ficonFiles.includes(filename)) {
    return `${ficons}/${filename}`
  } else {
    return `${originalIcons}/${filename}`
  }
})

ficonFiles.forEach(filename => {
  if (!originalFiles.includes(filename)) {
    filepaths.push(`${ficons}/${filename}`)
  }
})

// creating the fonts

console.log("Making Font...")
ficonsWebfontsGenerator(
  {
    fontName: "Ficons",
    files: filepaths,
    dest: "./dist/fonts",
    cssDest: "./dist/basic.ficons.css",
    cssTemplate: "./tpl/css.hbs",
    html: true,
    htmlDest: "./preview.html",
    htmlTemplate: "./tpl/html.hbs",
    json: true,
    jsonDest: "./dist/font.json",
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
      var basic = fs.readFileSync("./dist/basic.css", {
        encoding: "UTF-8"
      })

      // Add Cache Busting TO Font Files
      var find = "{{version}}"
      var regularExpression = new RegExp(find, "g")
      basic = basic.replace(regularExpression, config.version)

      // reading and concatenate the basic.css & basic.css into ficons.css

      var icons = fs.readFileSync("./dist/basic.ficons.css")

      var rawCSS = `${basic} \n\n ${icons}`
      fs.ensureFileSync("./dist/ficons.css")
      fs.writeFileSync("./dist/ficons.css", rawCSS)

      fs.ensureFileSync("./dist/ficons.min.css")
      fs.writeFileSync("./dist/ficons.min.css", new CleanCSS().minify(rawCSS))

      console.log(chalk.hex("#0496FF").bold("Done Writing Files!"))
    }
  }
)
