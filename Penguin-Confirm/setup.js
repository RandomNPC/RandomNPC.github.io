$(document).ready(()=>{
  $("#content-setup .form-control").change(function(){
    //get reference to the card being changed
    let $card_setup = $(this).parents(".card")[0];

    //Get index of text slot modified
    let text_slot = $.inArray(this,$($card_setup).find(".form-control"));

    //get index for database
    let db_index = $.inArray($card_setup,$("#content-setup .card"));

    //Get Database Reference
    let db = firebase.database().ref("penguins"+"/"+db_index+"/"+"entries/"+(Math.floor(text_slot/2)));
    let text = $(this).val();

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

  $("#content-home input").change(function(){
    let loc_desc = $(this).val();

    //get reference to the card being changed
    let $card_setup = $(this).parents(".card")[0];

    //Get index of text slot modified
    let text_slot = $.inArray(this,$($card_setup).find("input"));

    //get index for database
    let db_index = $.inArray($card_setup,$("#content-home .card"));

    let db = firebase.database().ref(`penguins/${db_index}`);
    db.update({
      location: loc_desc,
    })
  });
});
