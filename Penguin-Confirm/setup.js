$(document).ready(()=>{
  $("#content-setup .form-control").change(function(){
    //get reference to the card being changed
    var $card_setup = $(this).parents(".card")[0];

    //Get index of text slot modified
    var text_slot = $.inArray(this,$($card_setup).find(".form-control"));

    //get index for database
    var db_index = $.inArray($card_setup,$("#content-setup .card"));

    //Get Database Reference
    var db = firebase.database().ref("penguins"+"/"+db_index);

    switch(text_slot)
    {
      case 0:
        db.update({
          "main":$(this).val(),
        });
        break;
      case 1:
        db.update({
          "alt":$(this).val(),
        });
        break;
    }

  });
});
