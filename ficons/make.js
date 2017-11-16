const config = require("../package.json")

const fs = require("fs-extra")

const chalk = require("chalk")

const webfontsGenerator = require("ficons-webfont-generator")

// mapping the icons

const testFolder = "./ficons/icons"

const files = fs.readdirSync(testFolder)

const filepaths = files.map(filename => {
  return `./ficons/icons/${filename}`
})


// creating the fonts

console.log("Making Font...")
webfontsGenerator(
  {
    fontName: "Ficons",
    files: filepaths,
    dest: "./dist/fonts",
    cssTemplate: "./ficons/templates/css.hbs",
    templateOptions: {
      classPrefix: "fa-",
      baseSelector: ".fa"
    },
    descent: "256"
  },
  function (error) {
    if (error) {
      console.log("Fail!", error)
    } else {
      console.log(chalk.hex("#0496FF").bold("Done Making Font!"))

      console.log("Writing Files...")
      var basic = fs.readFileSync("./ficons/css/basic.css", {
        encoding: "UTF-8"
      })


      // handling the versions

      var find = "{{version}}"
      var regularExpression = new RegExp(find, "g")
      basic = basic.replace(regularExpression, config.version)


      // reading and concatenate the basic.css & basic.css into ficons.css

      var icons = fs.readFileSync("./ficons/css/iconfont.css")

      fs.ensureFileSync("./dist/css/ficons.css")

      fs.writeFileSync("./dist/css/ficons.css", `${basic} \n\n ${icons}`)

      console.log(chalk.hex("#0496FF").bold("Done Writing Files!"))
    }
  }
)
