var fs = require("hexo-fs")
var path = require("path")
var yaml = require("yaml-front-matter")

// Rewrite the URLs without index or post (index.md)
hexo.extend.filter.register("post_permalink", function(data) {
  data = data.replace("index/", "")

  data = data.replace("post/", "")

  return data
})

hexo.extend.filter.register("after_post_render", function(data) {
  const excerpt = yaml.loadFront(data.raw).excerpt
  const title = yaml.loadFront(data.raw).title

  if (!title && data.slug) {
    data.title = data.slug
      .replace("/index", "")
      .split("-")
      .join(" ")

    data.title = data.title.toLowerCase().replace(/\b[a-z]/g, function(letter) {
      return letter.toUpperCase()
    })
  }

  if (excerpt) {
    data.excerpt = excerpt
  } else {
    const words = 35
    const cont = data.excerpt ? data.excerpt : data.content
    data.excerpt = cont
      .replace(/<(?:.|\n)*?>/gm, "")
      .replace(/["“”]/g, "'")
      .split(" ")
      .slice(0, words)
      .join(" ")

    data.excerpt += `...`
  }

  return data
})

// Move images
hexo.source.addProcessor("posts/:id/:filename", function(file) {
  if (/\.(jpe?g|png|gif|bmp|svg)$/i.test(file.source)) {
    const rootDir = process.cwd()
    const publicDir = hexo.config.public_dir
    const id = file.params.id
    const filename = file.params.filename
    const dest = `${rootDir}/${publicDir}/p/${id}/${filename}`

    if (file.type === "delete") {
      if (fs.exists(dest)) {
        fs.unlink(dest)
      }
    } else {
      fs.copyFile(file.source, dest, function(err) {
        if (err) {
          console.log(err)
        }
      })
    }
  }
})
