var fs = require("fs-extra")
var path = require("path")
var execSync = require("child_process").execSync
var packageJson = require("./package.json")
var splitString = "######"
var readpath = "../"
var currentDir = process
  .cwd()
  .split(path.sep)
  .pop()

fs.readdir(readpath, function(err, items) {
  for (var i = 0; i < items.length; i++) {
    var theFile = items[i]

    if (
      currentDir != theFile &&
      fs.pathExistsSync(`${readpath}${items[i]}/_config.yml`)
    ) {
      fs.copySync("./themes", `${readpath}${items[i]}/themes/`, {
        overwrite: true
      })
      fs.copySync("./scripts", `${readpath}${items[i]}/scripts/`, {
        overwrite: true
      })

      fs.copySync("./update.js", `${readpath}${items[i]}/update.js`, {
        overwrite: true
      })

      fs.copySync("./makefile", `${readpath}${items[i]}/makefile`, {
        overwrite: true
      })

      fs.copySync("./.vscode", `${readpath}${items[i]}/.vscode`, {
        overwrite: true
      })

      // PACKAGE.JSON
      var rewritePackage = fs.readJsonSync(
        `${readpath}${items[i]}/package.json`
      )

      rewritePackage.dependencies = Object.assign(
        {},
        rewritePackage.dependencies,
        packageJson.dependencies
      )
      rewritePackage.devDependencies = Object.assign(
        {},
        rewritePackage.devDependencies,
        packageJson.devDependencies
      )

      fs.writeFileSync(
        `${readpath}${items[i]}/package.json`,
        JSON.stringify(rewritePackage, null, 4)
      )

      // CONFIG.YML

      var syncConfig = fs
        .readFileSync(`./_config.yml`, "UTF-8")
        .split(splitString)

      var rewriteConfig = fs
        .readFileSync(`${readpath}${items[i]}/_config.yml`, "UTF-8")
        .split(splitString)

      if (syncConfig.length == 2 && rewriteConfig.length == 2) {
        console.log("CONFIG", theFile)
        fs.writeFileSync(
          `${readpath}${items[i]}/_config.yml`,
          `${rewriteConfig[0]}${splitString}${syncConfig[1]}`
        )
      } else {
        console.log("Didnt work config", theFile)
      }

      console.log(`Updated "${theFile}" Files`)
    }
  }
})
