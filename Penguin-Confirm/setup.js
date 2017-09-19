$(document).ready(()=>{
  $("#content-setup .form-control").change(function(){
    //get reference to the card being changed
    var $card_setup = $(this).parents(".card")[0];

    //Get index of text slot modified
    var text_slot = $.inArray(this,$($card_setup).find(".form-control"));

    //get index for database
    var db_index = $.inArray($card_setup,$("#content-setup .card"));

    //Get Database Reference
    var db = firebase.database().ref("penguins"+"/"+db_index+"/"+"entries/"+(Math.floor(text_slot/2)));
    var text = $(this).val();

    switch(text_slot){
      case 0:
      case 2:
        db.update({
          index: text,
        });
        break;
      case 1:
      case 3:
        db.update({
          descriptor: text,
        });
        break;
    }
  });
});
