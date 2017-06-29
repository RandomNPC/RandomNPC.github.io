$(document).ready(function(){
  $("#content-home .icon").click(function(e){

    e.preventDefault();

    //Which card was clicked?
    var $card_target = $(this).parents(".card")[0];

    //Map this card to the database index it refers to
    var db_index = $.inArray($card_target,$("#content-home .card"));

    //Get Database Reference
    var db = firebase.database().ref("penguins"+"/"+db_index);

    //Get alt text to check if flipped
    var card_alt = $($($card_target).find(".alt")).text().replace(/:.+/g,"")

    db.update({
      "flip": (card_alt==="Alt")
    });
  });

  $("#content-home .btn").click(function(e){

    e.preventDefault();

    //Which card was clicked?
    var $card_target = $(this).parents(".card")[0];

    //Map this card to the database index it refers to
    var db_index = $.inArray($card_target,$("#content-home .card"));

    //Get Database ref
    var db = firebase.database().ref("penguins"+"/"+db_index);

    //If this value is confirm, then flip this value on update
    db.update({
      "confirm": ($(this).text()==="Confirm")
    });

  });
});
