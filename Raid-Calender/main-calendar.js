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
  $("#main-settings button:eq(0)").click(function(){
    var response = prompt("What will be your new screen name?");

    var user = firebase.auth().currentUser;
    var user_ref = firebase.database().ref('users').child(user.uid);

    user_ref.update({
      email: user.email,
      name: response,
      image: $("#user-image").attr("src"),
    });
  });

  //Settings: Change Image
  $("#main-settings button:eq(1)").click(function(){
    var response = prompt("Provide me a link to your image");

    var user = firebase.auth().currentUser;
    var user_ref = firebase.database().ref('users').child(user.uid);

    user_ref.update({
      email: user.email,
      image: response,
      name: $("#user-name").text(),
    });
  });

  //Clicking on button to join/decline raid or edit event (if host)
  $("#main-content").on("click","button",function(){
    let $root = $(this).parents(".card");
    let event_id = $root.attr('id');
    let host_uid =  $("#"+event_id + " .raid-host").attr('class').split(' ')[1];
    let client_uid = firebase.auth().currentUser.uid;
    let attendee_uids = $.map($("#"+event_id+" ul p"),(element)=>{
      return $(element).attr('class').split(' ')[0];
    });
    let db_ref = firebase.database();

    if(host_uid === client_uid)
    {
      //Host
    }
    else {
      //Client
      if($.inArray(client_uid,attendee_uids) >= 0)
      {
          //Client is not going to raid.
          db_ref.ref('raid-attendees/'+event_id+"/"+client_uid).remove();
      }
      else {
          //Client is going to raid.
          let attendee = {};
          attendee[client_uid] = new Date().getTime();
          db_ref.ref('raid-attendees/'+event_id).update(attendee);
      }
    }

  });



});

function BuildCalendarEntry(e,uid,user_data)
{

  var days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  var months = ["January","February","March","April","May","June","July","August","September","October","November","December"];

  let cal_event = e.val();

  return '<div id="'+e.key+'" class="card">' +
            '<div class="card-header" role="tab">' +
              '<div class="collapsed" data-toggle="" data-parent="#accordion" aria-expanded="false" aria-controls="collapseOne">' +
                '<div class="container-fluid">' +
                 '<div class="row">' +
                   '<div class="col-3">' +
                     '<div class="row">' +
                       '<div class="col-xs-12">' +
                          '<p class="week-name">'+days[new Date(cal_event.startTime).getDay()]+'</p>' +
                       '</div>' +
                     '</div>' +
                     '<div class="row">' +
                       '<div class="col-xs-2">' +
                          '<p class="month-name">'+months[new Date(cal_event.startTime).getMonth()]+'</p>' +
                       '</div>' +
                        '<div class="col-xs-8"></div>' +
                       '<div class="col-xs-2">' +
                          '<p class="day-month">'+new Date(cal_event.startTime).getDate()+'</p>' +
                       '</div>' +
                     '</div>' +
                   '</div>' +
                   '<div class="col-6">' +
                     '<div class="row">' +
                       '<div class="col-xs-12">' +
                          '<p class="raid-title">'+cal_event.title+'</p>' +
                       '</div>' +
                     '</div>' +
                     '<div class="row">' +
                       '<div class="col-xs-5">' +
                          '<p class="raid-time">'+ new Date(cal_event.startTime).toLocaleString().match(/([\d]{1,2}:[\d]{1,2}|[\d]{1,2}:[\d]{1,2} |[aApP][mM])/g).join().replace(','," ") +'</p>' +
                       '</div>' +
                        '<div class="col-xs-2">' +
                          '<p style="margin-right:0px;">by</p>' +
                       '</div>' +
                       '<div class="col-xs-5">' +
                          '<p class="raid-host '+uid+'">'+ user_data.name +'</p>' +
                       '</div>' +
                     '</div>' +
                   '</div>' +
                   '<div class="col-3">' +
                      '<button class="btn rsvp-status btn-success">Attend</button>' +
                    '</div>' +
                 '</div>' +
                  '<hr></hr>' +
                  '<div class="row">' +
                    '<div class="col-12">' +
                      '<ul>' +
                      '</ul>' +
                    '</div>' +
                  '</div>' +
                '</div>' +
              '</div>' +
            '</div>' +
            '<div class="collapse" role="tabpanel">' +
              '<div class="card-block">' +
                '<div class="container-fluid">' +
                 '<div class="row">' +
                 '<div class="col-12">' +
                     '<div class="row">' +
                       '<label class="col-4 col-form-label">Date & Time</label>' +
                       '<div class="col-8 form-group form-group-sm">' +
                          '<input type="datetime-local" class="form-control">' +
                       '</div>' +
                     '</div>' +
                     '<div class="row">' +
                        '<label class="col-4 col-form-label">Raid Title</label>' +
                       '<div class="col-8 form-group form-group-sm">' +
                          '<input type="text" class="form-control">' +
                       '</div>' +
                     '</div>' +
                   '</div>' +
                 '</div>' +
                  '<div class="row">' +
                    '<div class="col-4">' +
                      '<button type="button" class="btn btn-default">Delete</button>' +
                    '</div>' +
                    '<div class="col-4">' +
                      '<button type="button" class="btn btn-success">Update</button>' +
                    '</div>' +
                   '<div class="col-4">' +
                     '<button type="button" class="btn btn-danger">Cancel</button>'+
                   '</div>' +
                  '</div>' +
                '</div>' +
              '</div>' +
            '</div>' +
          '</div>';
}

function AddUserToEvent(event_id,attendee_uid,user_profile)
{
  let host_uid = $("#"+event_id+" .raid-host").attr('class').split(' ')[1];

  if(host_uid!=attendee_uid)
  {
    $("#"+event_id + " .rsvp-status").toggleClass("btn-danger btn-success");
    $("#"+event_id + " .rsvp-status.btn-danger").text("Cancel");
    $("#"+event_id + " .rsvp-status.btn-success").text("Attend");
  }


  return '<li>' +
          '<div class="container">' +
            '<div class="row">' +
              '<img class="'+attendee_uid+'" src="'+user_profile.image+'">' +
              '<p class="'+attendee_uid+'">'+user_profile.name+'</p>' +
            '</div>' +
          '</div>' +
         '</li>';
}

function StartApplication()
{
  $("#accordion").empty();
  let auth_ref = firebase.auth().currentUser;
  let db_ref = firebase.database();

  //get user profile
  db_ref.ref('users/'+auth_ref.uid).once('value').then((result)=>{
    let profile = result.val();
    $("#user-image, #settings-image").attr("src",profile.image);
    $.map($("#user-name, #settings-name"),(v)=>{$(v).text(profile.name);});
  });

  //Get calendar events
  db_ref.ref('raid-events').orderByChild('startTime')
                           .startAt(new Date().getTime())
                           .once('value')
                           .then((calendar_events)=>{
                             let calendar_promise = [];
                             let $calendar_root = $("#accordion");
                             calendar_events.forEach((calendar_event)=>{

                                let e = calendar_event.val(); //Calendar details
                                let e_key = calendar_event.key; //calendar event id

                                let c_event = db_ref.ref('raid-attendees/'+e_key)
                                                    .once('value').then((attendee_uid)=>{
                                                       let a_key = attendee_uid.key; //Attendees key

                                                       db_ref.ref('users').orderByChild('email')
                                                                          .equalTo(e.creator)
                                                                          .once('value')
                                                                          .then((host)=>{
                                                                              $.each(host.val(),(uid,user_data)=>{
                                                                               $calendar_root.append(BuildCalendarEntry(calendar_event, uid, user_data));

                                                                               if(uid === auth_ref.uid){
                                                                                 $("#"+e_key+" .rsvp-status").toggleClass("btn-warning btn-success").text("Edit");
                                                                               }

                                                                              });
                                                                          });

                                                       db_ref.ref('raid-attendees/'+e_key).once('value')
                                                                                          .then((users)=>{
                                                                                            users.forEach((user)=>{
                                                                                              let u_key = user.key;
                                                                                              db_ref.ref('users/'+u_key).once('value')
                                                                                                                        .then((profile)=>{
                                                                                                                           let p_key = profile.key;
                                                                                                                           let p = profile.val();
                                                                                                                           $("#"+e_key+" ul").append(AddUserToEvent(e_key,p_key,p));
                                                                                                                        });
                                                                                            });
                                                                                          });
                                                    });
                                calendar_promise.push(c_event);
                             });
                             return Promise.all(calendar_promise);
                           }).then((result)=>{
                             $("#login-screen").toggleClass("hidden",true);
                             $("#main-screen").toggleClass("hidden",false);

                             //When a player rsvp or cancels a raid
                              db_ref.ref('raid-attendees').on('child_changed',(snapshot)=>{

                                let event_id = snapshot.key;
                                let attendee_uids = $.map($("#"+event_id+" ul p"),(element)=>{
                                  return $(element).attr('class').split(' ')[0].toString();
                                });

                                let snapshot_uids = [];
                                $.each(snapshot.val(),(client_uid,time)=>{
                                  snapshot_uids.push(client_uid.toString());
                                });

                                //A filter B or B filter A
                                let delta_uids = attendee_uids.filter((entry)=>{
                                  return $.inArray(entry,snapshot_uids) < 0;
                                }).concat(snapshot_uids.filter((entry)=>{
                                  return $.inArray(entry,attendee_uids) < 0;
                                }));

                                if($.inArray(delta_uids[0],attendee_uids) >= 0)
                                {
                                  //Exists, delete
                                  $("#"+event_id+" ul ."+delta_uids[0]).parents("li").remove();
                                  $("#"+event_id + " .rsvp-status").toggleClass("btn-danger btn-success");
                                  $("#"+event_id + " .rsvp-status.btn-success").text("Attend");
                                }
                                else {
                                  //Nonexist, create
                                  db_ref.ref('users/'+delta_uids[0]).once('value')
                                                                 .then((profile)=>{
                                                                    let p_key = profile.key;
                                                                    let p = profile.val();
                                                                    $("#"+event_id+" ul").append(AddUserToEvent(event_id,p_key,p));
                                                                 });
                                }
                              })


                              ;

                             //When a player changes their profile
                             db_ref.ref('users').on('child_changed',(snapshot)=>{

                              let u_key = snapshot.key;
                              let u = snapshot.val();

                               //Name change
                               $.map($("."+u_key),(element)=>{$(element).text(u.name);});

                               $("img."+u_key).attr('src',u.image);

                               if(snapshot.key === firebase.auth().currentUser.uid)
                               {
                                 $("#user-name").text(u.name);
                                 $("#settings-name").text(u.name);
                                 $("#user-image").attr("src",u.image);
                                 $("#settings-image").attr("src",u.image);
                               }
                             });
                           });
}
