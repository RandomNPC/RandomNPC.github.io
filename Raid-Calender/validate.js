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
    }
  }
});
