var friendsAdded = false;
var friendsAddedList = [];
var friends = {};
var idsToNames = {};
var friendsAutocomplete = [];
var allFriends = [];
var recentArticles = [];

$("#fb-button").click(function() {
  ref.authWithOAuthPopup("facebook", function(error, authData) {
    if (error) {
      console.log("Login Failed!", error);
    } else {
      userID = authData.uid;
      facebookID = authData.facebook.id;
      userToken = authData.facebook.accessToken;
      ref.child("users").child(userID).on("value", function(snap) {
        if (snap.exists()) {
          // User exists
        } else {
          // Add user to db
          ref.child("users").child(userID).set({name: authData.facebook.displayName})
        }
      });
      $("#login").hide();
      $("#container").show();

      $.getJSON('https://graph.facebook.com/'+ facebookID +'/friends?access_token='+userToken+'', function(data) {
          $.each(data.data, function(index, value) {
            allFriends.push(value.name)
            friends[value.name] = value.id;
            idsToNames["facebook:" + value.id] = value.name;
          })
          populateRecentlyShared();
      })

      $("#searchInput").keyup(function () {

          var query = $("#searchInput").val();

          filtered = []
          recentArticles.each(function(index, value) {
              if ($(value).attr("search-tags").indexOf(query) != -1) {
                  filtered.push(value.outerHTML)
              }
          })
          $("#recent_articles").html(filtered.join(''))

      });

      // Populate friends list
      $("#friendsInput").autocomplete({
        source: function(req, res) {
          friendsAutocomplete = []
          allFriends = []
          $("#friends-list").empty()
          $.getJSON('https://graph.facebook.com/'+ facebookID +'/friends?access_token='+userToken+'', function(data) {
              $.each(data.data, function(index, value) {
                friendsAutocomplete.push(value.name)
              })
              res(friendsAutocomplete)
          })
        },
        appendTo: $("#friendsInput").next(),
        select: function (event, ui) {
          friendsAdded = true;
          var label = ui.item.label;
          $("#added-friends").append(
            "<div><p><i class=\"fa fa-times\"></i>" + label + "</p></div>")
            friendsAutocomplete.splice(friendsAutocomplete.indexOf(label), 1)
            friendsAddedList.push(label)
            $(this).autocomplete("option","source",friendsAutocomplete);
            $("#friendsInput").val('')
            updateButton()
        }
      });
    }
  },
  {
    scope: "email,public_profile,user_friends"
  });
})

function updateButton() {
  button = $("#send-button")
  if (friendsAdded && $("#linkInput").val() != "") {
    button.prop('disabled', false)
  } else {
    button.prop('disabled', true)
  }
}

function populateRecentlyShared() {
      // Get recently-shared
      var DataRef = new Firebase('https://keep-up.firebaseio.com/users/');
      var login_user = DataRef.child(userID + "/recently-shared");

      // Find relevant posts - snapshot to loop over users
      login_user.once("value", function(snapshot) {

          // Grab the child's info
          snapshot.forEach(function(childSnapshot) {
              var attributes = childSnapshot.val();
              tags = (attributes["tags"] == undefined ? [] : attributes["tags"])
              appendArticleDiv(attributes["title"], attributes["description"], attributes['link'], idsToNames[attributes["sender"]], tags);
          })
          recentArticles = $("#recent_articles .article-row")
      })
}

function appendArticleDiv(title, description, url, sender, tags) {

    var newLink = $('<a/>');
    $(newLink).attr("target", "_blank")
    $(newLink).attr("href", url);

    // Prep div + p tags
    var newArticle = $('<div/>');
    newArticle.addClass("article");
    newArticle.addClass("nine");
    newArticle.addClass("columns")

    var newTitle = $('<p/>');
    var newDescription = $('<p/>');

    newTitle.addClass("article-title");
    newDescription.addClass("article-author");

    // Load the info in
    newTitle.text(title);
    newDescription.text(description);

    // Append the p's -> div and div -> page
    newTitle.appendTo(newArticle);
    newDescription.appendTo(newArticle);

    newArticle.appendTo(newLink);

    sentBy = $("<div class='three columns'><div class='collaborators'><p>Shared by:</p></div><div class='collaborators names'><p><a href='#'>" +
              sender
                + "</a></p></div></div></div>"
              )

    var articleRow = $("<div/>")
    articleRow.addClass("article-row")

    articleRow.append(newLink);
    articleRow.append(sentBy);

    articleRow.attr("search-tags", title + " " + description + " " + tags.join(" "));

    articleRow.appendTo($("#recent_articles"));
  };
