var CALENDAR_ID = 'kvt7ldoc62n0hkadqsnr5v44po@group.calendar.google.com';

$(document).ready(function(){

  //Home Button
  $("#main-screen nav .nav-link:eq(1)").click(function(){
    $("#main-content").toggleClass("hidden",false);
    $("#main-settings").toggleClass("hidden",true);
  });

  //Settings Button
  $("#main-screen nav .nav-link:eq(2)").click(function(){
    $("#main-content").toggleClass("hidden",true);
    $("#main-settings").toggleClass("hidden",false);
    $("#settings-username").text($("#user-name").text());
  });

  //Log Out Button
  $("#main-screen nav .nav-link:eq(3)").click(function(){
    gapi.auth2.getAuthInstance().signOut();
  });

  //Settings: Change screenname
  $("#main-settings button").click(function(){
    var response = prompt("What will be your new screen name?");

    var user = firebase.auth().currentUser;
    var user_ref = firebase.database().ref('users').child(user.uid);

    user_ref.update({
      screenname: response,
    }).then(function(){
      $("#user-name").text(response);
      $("#settings-username").text(response);
    });
  });

});

function date(format)
{
  var days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  var months = ["January","February","March","April","May","June","July","August","September","October","November","December"];

  var date = new Date(new Date(format).toLocaleString());
  var d =
  {
    day_of_week: days[date.getDay()],
    month: months[date.getMonth()],
    day: date.getDate(),
    year: date.getFullYear(),
    time: new Date(format).toLocaleString().replace(/.+, /g,'').replace(/(:)(?!.*:)../g,'')
  };
  return d;
}

function UpdateListOfEvents(data){
  //Get the upcoming raid events
  //data value not used here
  gapi.client.calendar.events.list({
          'calendarId': CALENDAR_ID,
          'timeMin': (new Date()).toISOString(),
          'showDeleted': false,
          'singleEvents': true,
          'maxResults': 5,
          'orderBy': 'startTime'
        }).then(function(response) {

          var $root = $("#main-content");
          $root.empty();
          $.each(response.result.items,(index,value)=>{
            var content =
            '<div class="card">'+
              '<div class="card-block container">'+
                '<div class="row">'+
                  '<div class="col-md-2">'+
                    '<div class="text-center">'+ date(value.start.dateTime).day_of_week +'</div>'+
                    '<div class="text-center">'+ date(value.start.dateTime).day +'</div>'+
                  '</div>'+
                  '<div class="col-md-4">'+
                    '<div>'+value.summary+'</div>'+
                    '<div>'+((value.description === undefined) ? '' : value.description) +'</div>'+
                  '</div>'+
                  '<div class="col-md-4">'+
                    '<div> Time: ' + date(value.start.dateTime).time + '</div>' +
                    '<div> Host: ' + value.creator.displayName + '</div>'+
                  '</div>'+
                  '<div class="selection col-md-2">'+
                    '<button>Yes</button>'+
                    '<button>No</button>'+
                  '</div>'+
                '</div>'+
              '</div>'+
            '</div>';

            $root.append(content);
          });
        });
}

function StartApplication()
{
  //Listen to when Google calendar gets updated
  //Update each persons calendar calling calendar-update
  var ref = firebase.database().ref('calendar-update');
  ref.on('value',UpdateListOfEvents,(error)=>{});

  var user = firebase.auth().currentUser;
  var user_ref = firebase.database().ref('users').child(user.uid);

  //Picture
    $("#user-image").attr("src",user.photoURL);
  //Screen name
  user_ref.once('value').then(function(snapshot) {
    var value = snapshot.val();
    if(value)
    {
      //User exists
      $("#user-name").text(value.screenname)
    }
    else {
      //User doesn't exist. This can be changed in settings
      user_ref.set({
        screenname: user.displayName,
      });
    }
  })
  .catch(function(error){

  });
}
