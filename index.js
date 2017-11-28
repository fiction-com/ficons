module.exports = {
  config: function(fontName = "ficons") {
    var json = require(`./dist/${fontName}/font.config.json`)
    return json
  }
}
