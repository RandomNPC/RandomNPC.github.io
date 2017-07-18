var DATABASE = "players";

$(document).ready(function(){
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyCf9OcO4bzKT27Gx-5XxcnLnqAIls6bLTU",
    authDomain: "raid-worksheet-7a372.firebaseapp.com",
    databaseURL: "https://raid-worksheet-7a372.firebaseio.com",
    projectId: "raid-worksheet-7a372",
    storageBucket: "raid-worksheet-7a372.appspot.com",
    messagingSenderId: "21800807525"
  };
  firebase.initializeApp(config);

  var db_ref = firebase.database().ref(DATABASE);
  db_ref.on('value',Update,(error)=>{});

  $("#button-reset").click(function(){
    if(confirm("Wipe raid data?"))
    {
      ResetDatabase();
      UpdateTeamspeakDisplay();
      UpdateVideoDisplay();
    }
  });

});

function Update(data)
{
  //Purge all lists
  $.map($(".list"),(v)=>{$(v).empty();});
  $.map($(".card-block :hidden"),(v)=>{$(v).show();});

  $.each(data.val(),(index,value)=>{

    var $card = $($("#content-home .card")[index]);
    var $list = $card.find(".list");
    var $roles = $card.find(".card-block .btn");

    var $text = $card.find(".text");
    var $form = $card.find(".form-control");

    //Get Roles
    var extracted_roles = value.roles.toString().match(/[^,]+/g).sort(function(a,b){
      return parseInt(a) - parseInt(b);
    });

    //Append Roles
    $.map(extracted_roles,(v)=>{
      if(v >= 0)
      {
        var $ref = $($roles[v]);
        $ref.clone().appendTo($list);
      }
    })

    //Set Text
    $form.val(value.name);
    $text.text(value.name);

    //Turn off roles
    $.each($("#content-home .card").not($card), (index,value)=>{
      $.each(extracted_roles, (i,v)=>{$($(value).find(".card-block .btn")[v]).hide();});
    });
  });

  //Update Teamspeak
  UpdateTeamspeakDisplay();

  //Update Video
  UpdateVideoDisplay();
}

function ResetDatabase()
{
  var db_ref = firebase.database().ref(DATABASE);
  var db_contents = [];

  $.each($("#content-home .card"),function(index,value){
    var player_data =
    {
      name: "Player "+index,
      roles: "-1",
    };
    db_contents.push(player_data);
  });
  db_ref.update(db_contents);
}
