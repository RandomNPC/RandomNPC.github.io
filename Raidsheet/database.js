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
  db_ref.on('value',Populate,(error)=>{});

  $("#button-reset").click(function(){
    if(confirm("Wipe raid data?"))
    {
      ResetDatabase();
      UpdateTeamspeakDisplay();
      UpdateVideoDisplay();
    }
  });

});

function Populate(data)
{
  var db_data = $.map(data.val(),function(value){return value;});
  $.map($("#content-home .list"),function(value){$(value).empty();})

  $.each($("#content-home .card"),function(index,value){
    var $ref = $(value);
    $(value).find(".text").text(db_data[index].name);
    $(value).find(".form-control").text(db_data[index].name);
    if(db_data[index].roles != "-1")
    {
      $.each(db_data[index].roles.match(/\d+/g),function(i,v){
        AddRoleToPlayer("role-"+v,$ref,false);
      });
    }
  });
}

function UpdateDatabase($card)
{
  var db_ref = firebase.database().ref(DATABASE+"/"+$card.index());

  var player_data =
  {
    name: "",
    roles: "-1",
  };

  var name = $card.find(".text").text().replace(/^\s+|\s+$/g,"");
  player_data.name = name;

  var $list = $card.find(".list");

  $.each($list.children(),function(i,v){
    var role_id = $(v).attr("class").split(' ')[3].match(/\d+/g)[0];

    if(player_data.roles === "-1")
    {
      player_data.roles = role_id;
    }
    else {
      player_data.roles += ","+role_id;
    }
  });

  db_ref.set(player_data);
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
  db_ref.set(db_contents);
}
