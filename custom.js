// custom js
$(".icon-grid-item").on("click", function() {
  var textEl = $(this).find(".name")
  var text = textEl.text()
  var $temp = $("<input>")
  $("body").append($temp)
  $temp.val(text).select()
  document.execCommand("copy")
  $temp.remove()

  textEl.text("copied!")

  setTimeout(function() {
    textEl.text(text)
  }, 500)
})
