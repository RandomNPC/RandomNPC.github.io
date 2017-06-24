$(document).ready(function(){
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyDbq9h_dIl3dwlqvtXzZ8-VOA9Y3myu4t0",
    authDomain: "raid-worksheet-90937.firebaseapp.com",
    databaseURL: "https://raid-worksheet-90937.firebaseio.com",
    projectId: "raid-worksheet-90937",
    storageBucket: "raid-worksheet-90937.appspot.com",
    messagingSenderId: "214244885880"
  };
  firebase.initializeApp(config);

  var db_ref = firebase.database().ref("players");

  db_ref.on('value',Populate,(error)=>{});

});

function Populate(data)
{
  var db_data = $.map(data.val(),function(value){return value;});
  $.each($("#content-home .card"),function(index,value){
    var $ref = $(value);
    $(value).find(".text").text(db_data[index].name);
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
  var db_ref = firebase.database().ref("players/"+$card.index());

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

    if(roles === "-1")
    {
      roles = role_id;
    }
    else {
      roles += ","+role_id;
    }
  });

  db_ref.set(player_data);
}
