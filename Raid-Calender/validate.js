$(document).ready(function(){

  $("#login, #logout").toggle(false);

  var CLIENT_ID = '79847669821-7s19sehothfn3v4eeloalhng91pi9fmj.apps.googleusercontent.com';
  var CALENDAR_ID = 'kvt7ldoc62n0hkadqsnr5v44po@group.calendar.google.com';

  gapi.load('client', ()=>{
    gapi.client.init({
      discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"],
      clientId: CLIENT_ID,
      scope: 'https://www.googleapis.com/auth/calendar',
    }).then(()=>{

      gapi.auth2.getAuthInstance().isSignedIn.listen(login);

      var status = gapi.auth2.getAuthInstance().isSignedIn.get();
      login(status);

      $("#login").click(()=>{
        gapi.auth2.getAuthInstance().signIn();
      });

      $("#logout").click(()=>{
        gapi.auth2.getAuthInstance().signOut();
      });
    });
  });

  function login(status)
  {
    $("#login").toggle(!status);
    $("#logout").toggle(status);

    if(status)
    {
      /*
      gapi.client.calendar.events.list({
       'calendarId': CALENDAR_ID,
       'timeMin': (new Date()).toISOString(),
       'showDeleted': false,
       'singleEvents': true,
       'maxResults': 10,
       'orderBy': 'startTime'
     }).then((response)=>{

       $.each(response.result.items,(index,value)=>{
         $("#test").append('<p>' + value.start.dateTime + '</p>');
       });
     });
     */

     var event = {
      'summary': 'Test Event',
      'location': 'Your Nans House',
      'description': 'A Test Event. This is nothing',
      'start': {
        'dateTime': '2017-10-24T12:00:00-07:00',
        'timeZone': 'America/Los_Angeles'
      },
      'end': {
        'dateTime': '2017-10-24T19:00:00-07:00',
        'timeZone': 'America/Los_Angeles'
      },
      'recurrence': [
      //  'RRULE:FREQ=DAILY;COUNT=2'
      ],
      'attendees': [
        //{'email': 'lpage@example.com'},
        //{'email': 'sbrin@example.com'}
      ],
      'reminders': {
        //'useDefault': false,
        //'overrides': [
        //  {'method': 'email', 'minutes': 24 * 60},
        //  {'method': 'popup', 'minutes': 10}
        //]
      }
    };

  var request = gapi.client.calendar.events.insert({
    'calendarId': CALENDAR_ID,
    'resource': event
  });

  request.execute(function(event) {
    $("#test").append('<p>' + 'Event created: ' + event.htmlLink + '</p>');
  });
    }
  }
});
