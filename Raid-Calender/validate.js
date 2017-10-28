$(document).ready(function(){

  var CLIENT_ID = '79847669821-7s19sehothfn3v4eeloalhng91pi9fmj.apps.googleusercontent.com';

  firebase.initializeApp({
    apiKey: "AIzaSyDmFH4ggKydjXMGmvtRslmLFCXpAL4PnhE",
    authDomain: "raid-calender.firebaseapp.com",
    databaseURL: "https://raid-calender.firebaseio.com",
    projectId: "raid-calender",
    storageBucket: "",
    messagingSenderId: "549127986559"
  });

  gapi.load('client', ()=>{
    gapi.client.init({
      discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"],
      clientId: CLIENT_ID,
      scope: 'https://www.googleapis.com/auth/calendar',
    }).then(()=>{
      //Start listening for when the user logs in/out
      gapi.auth2.getAuthInstance().isSignedIn.listen(UpdateUserWebpage);

      //Check their sign in status, return true if the user is signed in
      UpdateUserWebpage(gapi.auth2.getAuthInstance().isSignedIn.get());
    });

    gapi.signin2.render('my-signin2', {
        'scope': 'profile email',
        'width': 240,
        'height': 50,
        'longtitle': true,
        'theme': 'dark',
    });
  });

  function UpdateUserWebpage(isLoggedIn)
  {

    //Handle Firebase Authentication via Google Authentication
    if(!isLoggedIn){
      $("#user-image").attr("src","");
      $("#user-name").text("");
      $("#login-screen").toggleClass("hidden",false);
      $("#main-screen").toggleClass("hidden",true);
      firebase.auth()
              .signOut()
              .then(function(error){});

      firebase.database().off();
    }
    else {
      var auth = gapi.auth2
                     .getAuthInstance()
                     .currentUser
                     .get().getAuthResponse().access_token;

      var cred = firebase.auth
                         .GoogleAuthProvider
                         .credential(null, auth);

      firebase.auth()
              .signInWithCredential(cred)
              .then(function(){
                StartApplication();
              })
              .catch(function(error){});
    }
  }

});
