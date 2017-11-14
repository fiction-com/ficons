var fs = require("hexo-fs")
var pathFn = require("path")
var CryptoJS = require("crypto-js")

hexo.extend.filter.register("after_post_render", function(data) {
  //console.log("DO SOMETHING", hexo)
  // close the encrypt function
  // if (
  //   !(
  //     "encrypt" in hexo.config &&
  //     hexo.config.encrypt &&
  //     "enable" in hexo.config.encrypt &&
  //     hexo.config.encrypt.enable
  //   )
  // ) {
  //   return data
  // }

  hexo.config.encrypt = {}

  hexo.config.encrypt.default_template = `<div id="security"> <div> <div class="input-container"> 
  <input type="password" class="form-control" id="pass" placeholder=" {{message}} "/>
  <label for="pass"> {{message}} </label> <div class="bottom-line"></div></div> </div> </div> 
  <div id="encrypt-blog" style="display:none"> {{content}} </div>`

  // no read more info
  hexo.config.encrypt.default_abstract =
    "This content is encrypted, enter password to view.<br>"

  hexo.config.encrypt.default_message =
    "<i class='fa fa-lock'></i> &nbsp;Enter Password"

  if ("password" in data && data.password) {
    // use the blog's config first
    console.log("encrypt the blog :" + data.title.trim())

    // store the origin data
    data.origin = data.content
    data.encrypt = true

    if (!("abstract" in data && data.abstract)) {
      data.abstract = hexo.config.encrypt.default_abstract
    }
    if (!("template" in data && data.template)) {
      data.template = hexo.config.encrypt.default_template
    }
    if (!("message" in data && data.message)) {
      data.message = hexo.config.encrypt.default_message
    }

    data.content = escape(data.content)
    data.content = CryptoJS.enc.Utf8.parse(data.content)
    data.content = CryptoJS.enc.Base64.stringify(data.content)
    data.content = CryptoJS.AES
      .encrypt(data.content, String(data.password))
      .toString()

    data.template = data.template.replace("{{content}}", data.content)
    data.template = data.template.replace("{{message}}", data.message)
    data.template = data.template.replace("{{message}}", data.message)

    data.content = data.template

    // console.log('hexo.url_for("js/encrypt-common.js")', hexo)

    // data.content = `<script src="js/encrypt-common.js"/><script>${data.content}`

    // data.content = `<script src="js/crypto-js.js"/><script>${data.content}`

    data.more = data.abstract
    data.excerpt = data.more
  }
  return data
})
