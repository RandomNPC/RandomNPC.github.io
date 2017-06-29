$(document).ready(function(){

  var config = {
    apiKey: "AIzaSyB42PW3MwrtNhxuAVUgGYFdDfjiVCqNpJ0",
    authDomain: "penguin-confirm.firebaseapp.com",
    databaseURL: "https://penguin-confirm.firebaseio.com",
    projectId: "penguin-confirm",
    storageBucket: "penguin-confirm.appspot.com",
    messagingSenderId: "124831971002"
  };
  firebase.initializeApp(config);

  var ref = firebase.database().ref('penguins');

  ref.on('value',Update,(error)=>{

  });

  function Update(data){

    $.each(data.val(),function(index,value){
      var $setup_card = $($("#content-setup .card")[index]);
      var $home_card = $($("#content-home .card")[index]);

      //Corresponding display
      var $main = $($home_card.find(".main")[0]);
      var $alt = $($home_card.find(".alt")[0]);

      //Corresponding text boxes
      var $main_box = $($setup_card.find(".box-main")[0]);
      var $alt_box = $($setup_card.find(".box-alt")[0]);

      //Set Text
      $main_box.val(value.main);
      $alt_box.val(value.alt);

      //Flip
      if(value.flip){
        $main.text(value.alt);
        $alt.text("Main: " + value.main);
      }
      else{
        $main.text(value.main);
        $alt.text("Alt: " + value.alt);
      }

      //Get references to the card, button, and rotate img
      var $card_header = $($home_card.find(".card-header")[0]);
      var $card_btn = $($home_card.find(".btn")[0]);
      var $card_rotate = $($home_card.find(".fa")[0]);

      //Toggle confirm skin
      $card_header.toggleClass("penguin-confirm",value.confirm);

      //Toggle Button Style
      $card_btn.toggleClass("btn-danger",value.confirm);
      $card_btn.toggleClass("btn-success",!value.confirm);

      //Change the button text
      $card_btn.text((!value.confirm) ? "Confirm" : "Deny");

      //show the rotate button
      $card_rotate.show();
      $alt.show();

      //Confirm
      if(value.confirm) //Flip this value because the user pressed the confirm button
      {
        $card_rotate.hide();
        $alt.hide();
      }
      else {
        $card_rotate.show();
        $alt.show();
      }
      
    });
  }
});
