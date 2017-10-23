$(document).ready(function(){
  $("#main-screen nav .nav-link:eq(1)").click(function(){
    gapi.auth2.getAuthInstance().signOut();
  });
});
