const each = require("p-each-series")
const crypto = require("crypto")
const removeMd = require("remove-markdown")

const algoliasearch = require("algoliasearch")
const algoliasearchhelper = require("algoliasearch-helper")

var INDEXED_PROPERTIES = [
  "title",
  "date",
  "updated",
  "path",
  "excerpt",
  "permalink",
  "layout"
]
const indexName = hexo.config.algolia.indexName

hexo.extend.console.register("searchindex", "Algolia Search", function(args) {
  const client = algoliasearch(
    hexo.config.algolia.applicationID,
    hexo.config.algolia.adminKey
  )

  const algoliaIndex = client.initIndex(hexo.config.algolia.indexName)

  hexo.load().then(function() {
    var pages = hexo.database
      .model("Page")
      .find({
        layout: {
          $in: ["page"]
        }
      })
      .toArray()

    var posts = hexo.database
      .model("Post")
      .find({ published: true })
      .toArray()

    const allPages = pages.concat(posts)

    let searchEntries = []
    allPages.forEach(page => {
      var pageInfo = pick(page, INDEXED_PROPERTIES)

      searchEntries.push(pageInfo)

      // console.log(page)

      const internalLinks = page["_content"].split("\n## ")
      internalLinks.forEach(intlink => {
        const inttitle = intlink.substr(0, intlink.indexOf("\n")) // "72"
        const intcontent = intlink.substr(intlink.indexOf("\n") + 1) // "tocirah sneab"

        if (inttitle != "" && intcontent != "") {
          searchEntries.push(
            Object.assign({}, pageInfo, {
              title: inttitle,
              permalink: `${pageInfo.permalink}#${slugify(inttitle)}`,
              path: `${pageInfo.path}#${slugify(inttitle)}`,
              excerpt: intcontent
            })
          )
        }
      })
    })

    searchEntries.forEach(entry => {
      entry.objectID = computeSha1(entry.path)
      entry.date_as_int = Date.parse(entry.date) / 1000
      entry.updated_as_int = Date.parse(entry.updated) / 1000
      entry.excerpt = removeMd(entry.excerpt)
      entry.title = removeMd(entry.title)

      entry.excerpt = entry.excerpt.replace(/ *\{\%[^)]*\%\} */g, "")
    })

    var actions = searchEntries.map(post => {
      return {
        action: "updateObject",
        indexName: indexName,
        body: post
      }
    })

    algoliaIndex.clearIndex()

    var chunks = chunk(actions, 50)

    each(chunks, function(chunk, i) {
      hexo.log.info(
        "[Algolia] Indexing chunk %d of %d (%d items each)",
        i + 1,
        chunks.length,
        50
      )

      return client.batch(chunk).catch(function(err) {
        hexo.log.error("[Algolia] %s", err.message)
      })
    })
  })
})

function computeSha1(text) {
  return crypto
    .createHash("sha1")
    .update(text, "utf8")
    .digest("hex")
}

function slugify(text) {
  text = removeMd(text)

  return text
    .toString()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/^-+/, "") // Trim - from start of text
    .replace(/-+$/, "") // Trim - from end of text
}

function pick(object, properties) {
  return properties.reduce(function(filteredObj, prop) {
    filteredObj[prop] = object[prop]
    return filteredObj
  }, {})
}

function chunk(array, chunkSize) {
  var batches = []

  while (array.length > 0) {
    batches.push(array.splice(0, chunkSize))
  }

  return batches
}

// exports.searchIndex = functions.database
//   .ref("/search/items/{searchid}")
//   .onWrite(event => {
//     const searchid = event.params.searchid
//     const searchitem = event.data.val()

//     const searchIndex = searchitem.searchIndex
//     const searchObject = searchitem.searchObject

//     const objectID = event.data.key

//     searchObject.objectID = objectID

//     if (searchObject.location && searchObject.location["_geoloc"]) {
//       searchObject["_geoloc"] = searchObject.location["_geoloc"]
//     }

//     if (!searchIndex) {
//       return
//     }

//     const algoliaIndex = client.initIndex(searchIndex)

//     if (!searchObject) {
//       return algoliaIndex.deleteObject(objectID, function(err) {
//         admin
//           .database()
//           .ref(`/search/deleted/${searchid}`)
//           .set(searchObject)

//         return
//       })
//     } else {
//       return algoliaIndex.saveObject(searchObject).then(() => {
//         admin
//           .database()
//           .ref(`/search/added/${searchid}`)
//           .set(searchObject)

//         return
//       })
//     }
//   })
