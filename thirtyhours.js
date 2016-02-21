$("#linkInput").keyup(function() {
  updateButton()
  link = $("#linkInput").val()
  var expression = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
  var regex = new RegExp(expression);
  if (link.match(regex)) {
    if (link.startsWith("http")) {
      link = link.substring(link.indexOf("://") + 3)
    }
    link = encodeURIComponent(encodeURIComponent(link))
    $.get("http://localhost:8080/preview/" + link, function(data) {
      data = JSON.parse(data)
      $("#share-details").show()
      document.getElementById("preview-title").innerHTML = data.title
      document.getElementById("preview-description").innerHTML = data.description
      $("#preview-image").attr("src", data.image_link)
    })
  }
})
