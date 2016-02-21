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
      $("#dashboard").show();
      $.getScript( "main.js", function() {})
    }
  },
  {
    scope: "email,public_profile,user_friends"
  });
})
