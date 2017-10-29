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
      name: response,
    });
  });

  //Clicking on button to join/decline raid
  $("#main-content").on("click","button",function(){
    var $source = $(this);
    var event_id = $($(this).parents()[3]).attr("id");

    //Add/Remove person going to a raid
    var uid = firebase.auth().currentUser.uid;
    var event_ref = firebase.database().ref('raid-attendees/'+event_id);
    event_ref.once('value',(data)=>{
     if(data.hasChild(uid))
     {
       //We found results, remove person (not going)
       event_ref.child(uid).remove();

     }
     else {
       //We found nothing, add person (going)
       var content = {};
       content[uid] = true;
       event_ref.update(content);
     }
   });
  });



});

function BuildCalendarEntry(e)
{
  var days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  var params = e.val();

  return '<div id="'+e.key+'"class="card">' +
            '<div class="card-block container">' +
              '<div class="row">' +
                '<div class="col-md-2">' +
                  '<div class="text-center">'+ days[new Date(params.startTime).getDay()] +'</div>'+
                  '<div class="text-center">'+ new Date(params.startTime).getDate() +'</div>'+
                '</div>'+
                '<div class="col-md-2">' +
                  '<div>'+ params.title +'</div>'+
                  '<div>'+ params.description +'</div>'+
                '</div>'+
                '<div class="col-md-2">' +
                  '<div> Time: ' + new Date(params.startTime).toLocaleString().match(/([\d]{1,2}:[\d]{1,2}|[\d]{1,2}:[\d]{1,2} |[aApP][mM])/g).join().replace(','," ") + '</div>' +
                  '<div class="host">'+params.creator+'</div>' +
                '</div>'+
                '<div class="selection col-md-2 text-center">'+
                  '<button class="btn btn-success">Going</button>'+
                '</div>'+
                '<div class="selection col-md-4">'+
                  '<div>'+
                    '<ul></ul>'+
                  '</div>'+
                '</div>'+
              '</div>'+
            '</div>'+
          '</div>';

}

function StartApplication()
{
  $("#main-content").empty();
  var db_ref = firebase.database();
  //Set the calendar structure before listening to events
  db_ref.ref('raid-events').orderByChild('startTime')
                           .startAt(new Date().getTime())
                           .once('value',(calendar_events)=>{
                             let event_promises = [];
                             calendar_events.forEach((calendar_event)=>{
                                var e = calendar_event;
                                var promise = $("#main-content").append(BuildCalendarEntry(e));
                                event_promises.push(promise);
                             });
                             return Promise.all(event_promises);
                           }).then((results)=>{
                             let host_promises = [];
                             results.forEach((res)=>{
                               let host_promise = db_ref.ref('users')
                                                        .orderByChild('email')
                                                        .equalTo($("#"+res.key + " .host").text())
                                                        .once('value')
                                                        .then((user)=>{
                                                          $.each(user.val(),(index,value)=>{
                                                            $("#"+res.key + " .host").text("Host: "+value.name);
                                                            $("#"+res.key + " .host").addClass(index);
                                                            //You can't unattend raid if you are host
                                                            if(index === firebase.auth().currentUser.uid)
                                                            {
                                                              $("#"+res.key+" button").hide();
                                                            }
                                                          });
                                                        });
                               host_promises.push(host_promise);
                             });
                             return Promise.all(host_promises);
                           }).then((rsvp)=>{
                             return db_ref.ref('raid-attendees').once('value').then((attendees)=>{
                               let attendee_promises = [];
                               attendees.forEach(attendee=>{
                                  $.each(attendee.val(),(index,value)=>{
                                    let attendee_promise = db_ref.ref('users/'+index)
                                                                 .once('value')
                                                                 .then((user)=>{
                                                                   let u = user.val();
                                                                   $("#"+attendee.key+" ul").append('<li class="'+index+'"><p><img src="'+u.image+'" width="40" height="40" style="padding:5px; border-radius: 50%;">'+u.name+'</p></li>');
                                                                   if(index === firebase.auth().currentUser.uid)
                                                                   {
                                                                     $("#"+attendee.key+" button").text("Not Going");
                                                                     $("#"+attendee.key+" button").toggleClass("btn-success",false);
                                                                     $("#"+attendee.key+" button").toggleClass("btn-danger",true);
                                                                   }
                                                                   else{
                                                                     $("#"+attendee.key+" button").text("Going");
                                                                     $("#"+attendee.key+" button").toggleClass("btn-success",true);
                                                                     $("#"+attendee.key+" button").toggleClass("btn-danger",false);
                                                                   }
                                                                 });
                                    attendee_promises.push(attendee_promise);
                                  });
                               });
                               return Promise.all(attendee_promises);
                             });
                           }).then((update_profile)=>{
                             return firebase.database().ref('users/'+firebase.auth().currentUser.uid).once('value').then((user)=>{
                               let u = user.val();
                               $("#user-image").attr("src",u.image);
                               $("#user-name").text(u.name);
                               $("#settings-username").text(u.name);
                             }).then((final)=>{
                               $("#login-screen").toggleClass("hidden",true);
                               $("#main-screen").toggleClass("hidden",false);
                             }).catch((error)=>{
                               //Profile couldn't be found. Don't delete profile while person is logged in :(
                               console.log(error);
                               gapi.auth2.getAuthInstance().signOut();
                             });
                           }).then((listen_events)=>{

                             //When raid event content gets changed on the webpage
                             db_ref.ref('raid-events').on('child_changed',(snapshot)=>{
                                console.log("Changed: " + JSON.stringify(snapshot.val()));
                             });

                             //When a raid event gets removed on the webpage
                             db_ref.ref('raid-events').on('child_removed',(snapshot)=>{
                               $("#"+snapshot.key).remove();
                               console.log("Removed: " + JSON.stringify(snapshot.val()));
                             });

                             //When a raid event gets added to the webpage
                             db_ref.ref('raid-events').on('child_added',(snapshot)=>{
                               if($("#"+snapshot.key).length <= 0)
                               {
                                //This entry never existed before, so add a new entry
                                console.log("Added: " + JSON.stringify(snapshot.val()));
                               }
                             });

                             //When a user other than the host changes RSVP status
                             db_ref.ref('raid-attendees').on('child_changed',(snapshot)=>{
                                let original_set = $.map($("#"+snapshot.key+" ul li"),(element)=>{
                                                      return $(element).attr("class");
                                                   });

                                let new_set = [];
                                $.each(snapshot.val(),(uid,state)=>{new_set.push(uid);});

                                let diffA = new_set.filter((element)=>{
                                    return !original_set.includes(element);
                                });

                                let diffB = original_set.filter((element)=>{
                                    return !new_set.includes(element);
                                });

                                if(diffA.length > diffB.length){
                                  db_ref.ref('users/'+diffA[0]).once('value').then((user)=>{
                                    let u = user.val();

                                    $("#"+snapshot.key+" ul").append('<li class="'+user.key+'"><p><img src="'+u.image+'" width="40" height="40" style="padding:5px; border-radius: 50%;">'+u.name+'</p></li>');
                                    if(user.key === firebase.auth().currentUser.uid)
                                    {
                                      $("#"+snapshot.key+" button").text("Not Going");
                                      $("#"+snapshot.key+" button").toggleClass("btn-success",false);
                                      $("#"+snapshot.key+" button").toggleClass("btn-danger",true);
                                    }
                                  });
                                }
                                else {
                                  $("#"+snapshot.key+" ul ."+diffB[0]).remove();

                                  if(diffB[0] === firebase.auth().currentUser.uid)
                                  {
                                    $("#"+snapshot.key+" button").text("Going");
                                    $("#"+snapshot.key+" button").toggleClass("btn-success",true);
                                    $("#"+snapshot.key+" button").toggleClass("btn-danger",false);
                                  }
                                }
                             });

                             db_ref.ref('users').on('child_changed',(snapshot)=>{
                               $.map($("."+snapshot.key+" p:not(host)"),(element)=>{$(element).get(0).lastChild.nodeValue = snapshot.val().name;});
                               $(".host."+snapshot.key).text("Host: " + snapshot.val().name);

                               if(snapshot.key === firebase.auth().currentUser.uid)
                               {
                                 $("#user-name").text(snapshot.val().name);
                                 $("#settings-username").text(snapshot.val().name);
                               }
                             });
                           });
}
