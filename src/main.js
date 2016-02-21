$.getJSON('https://graph.facebook.com/'+ facebookID +'/friends?access_token='+userToken+'', function(data) {
    console.log(data);
    var friends = $("#friends");
    $.each(data.data, function(index, value) {
      friendNode = $("<li id=facebook:" + value.id + ">" + value.name + "</li>");
      friends.append(friendNode)
    })
  $("#friends li").click(function() {
    showFriendPage(this.id)
  })
})


function showFriendPage(id) {
  var friends = $("#friends")
  var clickedFriend = $("#" + id)
  // Hide not clicked friend
  $("#friends li").each(function(index, friend) {
    friend = $(friend)
    if (friend.attr('id') != id) {
      friend.hide()
    }
  })
  clickedFriend.css({fontSize: 20})

  // Get the shared items between two friends
  var friendship = $("#friendship")
  var friendshipRef = ref.child("users").child(userID).child("friends").child(id)
  friendshipRef.on("child_added", function(snapshot) {
    data = snapshot.val()
    linkItem = $("<li></li>")
    linkItem.attr('id', data.id)
    if (data['sender-id'] == userID) {
      linkItem.addClass('sent-by-me')
    } else {
      linkItem.addClass('sent-by-other')
    }
    linkItem.html(data.title)
    friendship.append(linkItem)
  })
}
