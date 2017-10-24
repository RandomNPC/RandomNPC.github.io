var CALENDAR_ID = 'kvt7ldoc62n0hkadqsnr5v44po@group.calendar.google.com';

$(document).ready(function(){

  $("#main-screen nav .nav-link:eq(1)").click(function(){
    gapi.auth2.getAuthInstance().signOut();
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
  return d;//d.day_of_week + ", " + d.month + " " + d.day + " " + d.year;
}

function StartApplication()
{
  gapi.client.calendar.events.list({
            'calendarId': CALENDAR_ID,
            'timeMin': (new Date()).toISOString(),
            'showDeleted': false,
            'singleEvents': true,
            'maxResults': 5,
            'orderBy': 'startTime'
          }).then(function(response) {

            var $root = $("#main-content");

            $.each(response.result.items,(index,value)=>{
              console.log(value)
              var content =
              '<div class="card">'+
                '<div class="card-block container">'+
                  '<div class="row">'+
                    '<div class="col-md-3">'+
                      '<div>'+ date(value.start.dateTime).day_of_week +'</div>'+
                      '<div>'+ date(value.start.dateTime).day +'</div>'+
                    '</div>'+
                    '<div class="col-md-3">'+
                      '<div>'+value.summary+'</div>'+
                      '<div>'+((value.description === undefined) ? '' : value.description) +'</div>'+
                    '</div>'+
                    '<div class="col-md-3">'+
                      '<div> Time: ' + date(value.start.dateTime).time + '</div>' +
                      '<div> Host: ' + value.creator.displayName + '</div>'+
                    '</div>'+
                    '<div class="selection col-md-3">'+
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
