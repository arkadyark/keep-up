$("#linkInput").keyup(function() {
  link = $("#linkInput").val()
  var expression = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
  var regex = new RegExp(expression);
  if (link.match(regex)) {
    if (link.startsWith("http")) {
      link = link.substring(link.indexOf("://") + 3)
    }
    link = encodeURIComponent(encodeURIComponent(link))
    $.get("http://localhost:8080/preview/" + link, function(data) {
      $("#share-details").show()
      console.log(data)
      $("#preview-title").text(data.title)
      console.log("Changed the title")
      console.log($("#preview-title").text())
      $("#preview-description").text(data.description)
      console.log("Changed the description")
      $("#preview-image").attr("src", data.image_link)
    })
  }
})
