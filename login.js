var friendsAdded = false;
var friends = {};
var friendsAutocomplete = [];

$("#fb-button").click(function() {
  ref.authWithOAuthPopup("facebook", function(error, authData) {
    if (error) {
      console.log("Login Failed!", error);
    } else {
      console.log("Authenticated successfully with payload:", authData);
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

      // Populate friends list
      $("#friendsInput").autocomplete({
        source: function(req, res) {
          friendsAutocomplete = []
          $("#friends-list").empty()
          $.getJSON('https://graph.facebook.com/'+ facebookID +'/friends?access_token='+userToken+'', function(data) {
              $.each(data.data, function(index, value) {
                friendsAutocomplete.push(value.name)
                friends[value.name] = value.id;
                $("#friends-list").append($("<li id=facebook:" + value.id + ">" + value.name + "</li>"))
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
            $(this).autocomplete("option","source",friendsAutocomplete);
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
