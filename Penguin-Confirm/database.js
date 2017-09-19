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

  ref.on('value',Update,(error)=>{});

  function Update(data){
    $.each(data.val(),function(index,value){

      $.each($("#content-setup .card:eq("+index+") .col-5"),(i,v)=>{

          //ID
          $($(v).find("input:first")).val(value.entries[i].index);

          //Descriptor
          $($(v).find("input:last")).val(value.entries[i].descriptor);
      });

      //Home Page Entry for each card

      $("#content-home .card:eq("+index+") .col-7 >:eq(0)").text(value.entries[value.index].descriptor);
      $("#content-home .card:eq("+index+") .col-7 >:eq(1)").text(value.entries[(value.index + 1) % value.entries.length].descriptor);

      //Toggle confirm skin
      $("#content-home .card:eq("+index+") .card-header").toggleClass("penguin-confirm",value.confirm);

      //Toggle Button Style
      $("#content-home .card:eq("+index+") button").toggleClass("btn-danger",value.confirm);
      $("#content-home .card:eq("+index+") button").toggleClass("btn-success",!value.confirm);

      //Change Button Text
      $("#content-home .card:eq("+index+") button").text((!value.confirm) ? "Confirm" : "Deny");

      $("#content-home .card:eq("+index+") .fa").show();
      $("#content-home .card:eq("+index+") .col-7 > :eq(1)").show();

      if(value.confirm)
      {
        $("#content-home .card:eq("+index+") .fa").hide();
        $("#content-home .card:eq("+index+") .col-7 > :eq(1)").hide();
      }

    });

  }
});
