"use strict"

/* global hexo */
//console.log(hexo)

// hexo.extend.filter.register(
//   "before_post_render",
//   function(data) {
//     data.content = "this is replacement but wont work" + data.content

//     hexo.locals.invalidate()
//   },
//   9
// )

// "use strict"

// var reg = /(\s*)(```) *(mermaid) *\n?([\s\S]+?)\s*(\2)(\n+|$)/g

// function ignore(data) {
//   var source = data.source
//   var ext = source.substring(source.lastIndexOf(".")).toLowerCase()
//   return [".js", ".css", ".html", ".htm"].indexOf(ext) > -1
// }

// function getFlowId(index) {
//   return "flowchart-" + index
// }

// function render(data) {
//   if (!ignore(data)) {
//     var flows = []

//     data.content = data.content.replace(reg, function(
//       raw,
//       start,
//       startQuote,
//       lang,
//       content,
//       endQuote,
//       end
//     ) {
//       console.log("CONT", content)
//       return `<div id="id1" class="mermaid-render-test">{% raw %}${content}{% endraw %}</div>`
//     })
//   }
// }

// hexo.extend.filter.register("before_post_render", render, 9)

