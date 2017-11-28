module.exports = function(fontName = "ficons") {
  return {
    cssFile: `node_modules/ficons/dist/${fontName}/font.min.css`,
    cssFileRaw: `node_modules/ficons/dist/${fontName}/font.css`,
    jsonFile: `node_modules/ficons/dist/${fontName}/font.config.json`,
    json: require(`./dist/${fontName}/font.config.json`)
  }
}
