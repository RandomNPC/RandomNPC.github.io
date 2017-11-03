var CALENDAR_ID = 'kvt7ldoc62n0hkadqsnr5v44po@group.calendar.google.com';

$(document).ready(function(){

  //Home Button
  $("#main-screen nav .nav-link:eq(1)").click(function(){
    $("#main-content").toggleClass("hidden",false);
    $("#main-settings").toggleClass("hidden",true);
    $("#main-create-event").toggleClass("hidden",true);
  });

  //Create Event
  $("#main-screen nav .nav-link:eq(2)").click(function(){
    $("#main-content").toggleClass("hidden",true);
    $("#main-create-event").toggleClass("hidden",false);
  });

  //Settings Button
  $("#main-screen nav .nav-link:eq(3)").click(function(){
    $("#main-content").toggleClass("hidden",true);
    $("#main-settings").toggleClass("hidden",false);
  });

  //Log Out Button
  $("#main-screen nav .nav-link:eq(4)").click(function(){
    gapi.auth2.getAuthInstance().signOut();
    location.reload();
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
      $root.find(".collapse").toggleClass('show hide');
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

  //Host: Delete Raid
  $("#main-content").on("click",".collapse button.btn-default",function(){
    let $root = $(this).parents(".card");
    let event_id = $root.attr('id');

    if(confirm("Remove this event?"))
    {
      //Removing event
      gapi.client.calendar.events.delete({
          calendarId: CALENDAR_ID,
          eventId: event_id,
      }).execute((result)=>{
        firebase.database().ref('raid-events/'+event_id).remove();
        firebase.database().ref('raid-attendees/'+event_id).remove();
      });
    }
    else {
      let $root = $($(this).parents()[5]);
      $root.find(".collapse").collapse('hide');
    }
  });

  //Host: Update Raid Details
  $("#main-content").on("click",".collapse button.btn-success",function(){
    let $root = $(this).parents(".card");
    let event_id = $root.attr('id');

    let $event_details = $($($(this).parents()[2]).find("input")[0]);
    let start_date = new Date($event_details.val());
    start_date = moment(start_date).format("YYYY-MM-DDTHH:mm:ss");

    let $event_title = $($($(this).parents()[2]).find("input")[1]);
    let title = $event_title.val();

    let timezone = moment.tz.guess();

    gapi.client.calendar.events.update({
      calendarId: CALENDAR_ID,
      eventId: event_id,
      resource: {
        start: {
            dateTime: start_date,//end,
            timeZone: timezone,
        },
        end: {
            dateTime: moment(start_date).add(1,"h").format("YYYY-MM-DDTHH:mm:ss"),//start,
            timeZone: timezone,
        },
        summary: title,
      },
    }).execute((result)=>{

      if(result.code == 400){ return; }

      firebase.database().ref('raid-events/'+event_id).update(
        {
          startTime: new Date(start_date).getTime(),
          creator: firebase.auth().currentUser.email,
          title: title,
          description: "",
        }
      );

    });
  });

  //Host: Cancel Raid Details
  $("#main-content").on("click",".collapse button.btn-danger",function(){
    let $root = $($(this).parents()[5]);
    $root.find(".collapse").collapse('hide');
  });

  //Create Raid - Cancel
  $("#main-create-event button:eq(0)").click(function(){
    $("#main-content").toggleClass("hidden",false);
    $("#main-settings").toggleClass("hidden",true);
    $("#main-create-event").toggleClass("hidden",true);
  });

  //Create Raid - Submit
  $("#main-create-event button:eq(1)").click(function(){

    let start_date = $("#main-create-event input:eq(0)").val();
    let event_title = $("#main-create-event input:eq(1)").val();

    start_date = new Date(start_date);
    let event_date = moment(start_date).format("YYYY-MM-DDTHH:mm:ss");

    let timezone = moment.tz.guess();

    gapi.client.calendar.events.insert({
      calendarId: CALENDAR_ID,
      resource:{
        start: {
            dateTime: event_date,//end,
            timeZone: timezone,
        },
        end: {
            dateTime: moment(event_date).add(1,"h").format("YYYY-MM-DDTHH:mm:ss"),//start,
            timeZone: timezone,
        },
        summary: event_title,
      },
    }).execute((result)=>{
      if(result.code == 400 || result.code == 403){return;}

      let host_uid = {};
      host_uid[firebase.auth().currentUser.uid] = new Date().getTime();

      firebase.database().ref('raid-attendees/'+result.id).update(host_uid).then(()=>{
        firebase.database().ref('raid-events/'+result.id).update({
          startTime: start_date.getTime(),
          creator: result.creator.email,
          title: event_title,
          description: "",
        });
      });

    });

  });

});

function BuildCalendarEntry(e,uid,user_data)
{

  let cal_event = e.val();

  return '<div id="'+e.key+'" class="card">' +
            '<div class="card-header" role="tab">' +
              '<div class="collapsed" data-toggle="" data-parent="#accordion" aria-expanded="false">' +
                '<div class="container-fluid">' +
                 '<div class="row">' +
                   '<div class="col-3">' +
                     '<div class="row">' +
                       '<div class="col-xs-12">' +
                          '<p class="week-name">'+moment(cal_event.startTime).format('dddd')+'</p>' +
                       '</div>' +
                     '</div>' +
                     '<div class="row">' +
                       '<div class="col-xs-2">' +
                          '<p class="month-name">'+moment(cal_event.startTime).format("MMM")+'</p>' +
                       '</div>' +
                        '<div class="col-xs-8"></div>' +
                       '<div class="col-xs-2">' +
                          '<p class="day-month">'+moment(cal_event.startTime).format("Do")+'</p>' +
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
                          '<p class="raid-time">'+ moment(cal_event.startTime).format('LT') +'</p>' +
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
                     '<div class="col-12">' +
                        '<ul class="list-group">' +
                            '<li class="list-group-item row">' +
                            '</li>' +
                        '</ul>' +
                      '</div>' +
                    '</div>' +
                  '</div>' +
                '</div>' +
              '</div>' +
            '</div>' +
            '<div class="collapse hide" role="tabpanel">' +
              '<div class="card-block">' +
                '<div class="container-fluid">' +
                 '<div class="row">' +
                 '<div class="col-12">' +
                     '<div class="row">' +
                       '<label class="col-4 col-form-label">Date & Time</label>' +
                       '<div class="col-8 form-group form-group-sm">' +
                          '<input type="datetime-local" class="form-control" value="">' +
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
  return '<div class="col-6 container-fluid">' +
            '<div class="row">' + //justify-content-center
              '<img class="'+attendee_uid+'" src="'+user_profile.image+'">' +
              '<p class="'+attendee_uid+'">'+user_profile.name+'</p>' +
            '</div>' +
          '</div>';
}

function StartApplication()
{
  let auth_ref = firebase.auth().currentUser;
  let db_ref = firebase.database();

  //get user profile
  db_ref.ref('users').once('value').then((result)=>{

    if(result.hasChild(auth_ref.uid))
    {
      let profile = result.child(auth_ref.uid).val();
      $("#user-image, #settings-image").attr("src",profile.image);
      $.map($("#user-name, #settings-name"),(v)=>{$(v).text(profile.name);});
    }
    else {
      db_ref.ref('users/'+auth_ref.uid).set({
        email: auth_ref.email,
        name: auth_ref.displayName,
        image: auth_ref.photoURL,
      }).then((result)=>{
        $("#user-image, #settings-image").attr("src",auth_ref.photoURL);
        $.map($("#user-name, #settings-name"),(v)=>{$(v).text(auth_ref.displayName);});
      });
    }
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
                                                                                 $("#"+e_key+" .rsvp-status").addClass("btn-warning").removeClass("btn-success").text("Edit");
                                                                               }

                                                                               let e = calendar_event.val();

                                                                               $("#"+e_key+" input:eq(0)").attr('value',moment(e.startTime).format('YYYY-MM-DDTHH:mm'));

                                                                               $("#"+e_key+" input:eq(1)").val(e.title);

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
                                                                                                                           $("#"+e_key+" .list-group-item").append(AddUserToEvent(e_key,p_key,p));

                                                                                                                           let host_uid =  $("#"+e_key + " .raid-host").attr('class').split(' ')[1];

                                                                                                                           if(auth_ref.uid === u_key && u_key != host_uid)
                                                                                                                           {
                                                                                                                             $("#"+e_key + " .rsvp-status").addClass("btn-danger").removeClass("btn-success").text("Cancel");
                                                                                                                           }
                                                                                                                        });
                                                                                            });
                                                                                          });
                                                    });
                                calendar_promise.push(c_event);
                             });
                             return Promise.all(calendar_promise);
                           }).then(()=>{

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

                                let delta_uid = delta_uids[0];

                                if($.inArray(delta_uid,attendee_uids) >= 0)
                                {
                                  //Exists, delete
                                  $($("#"+event_id+" ul ."+delta_uid).parents()[1]).remove();
                                  if(auth_ref.uid === delta_uid)
                                  {
                                    $("#"+event_id + " .rsvp-status").addClass("btn-success").removeClass("btn-danger").text("Attend");
                                  }
                                }
                                else {
                                  //Nonexist, create
                                  db_ref.ref('users/'+delta_uid).once('value')
                                                                 .then((profile)=>{
                                                                    let p_key = profile.key;
                                                                    let p = profile.val();
                                                                    $("#"+event_id+" .list-group-item").append(AddUserToEvent(event_id,p_key,p));
                                                                    if(auth_ref.uid === delta_uid)
                                                                    {
                                                                      $("#"+event_id + " .rsvp-status").addClass("btn-danger").removeClass("btn-success").text("Cancel");
                                                                    }
                                                                 });
                                }
                              });

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

                              //When a raid event details change
                              db_ref.ref('raid-events').on('child_changed',(snapshot)=>{
                                let s_key = snapshot.key;
                                let s = snapshot.val();

                                $("#"+s_key+" .raid-title").text(s.title);
                                $("#"+s_key+" .raid-time").text(moment(s.startTime).format('LT'));
                                $("#"+s_key+" .week-name").text(moment(s.startTime).format('dddd'));
                                $("#"+s_key+" .month-name").text(moment(s.startTime).format("MMM"));
                                $("#"+s_key+" .day-month").text(moment(s.startTime).format("Do"));
                              });

                              //When an event gets deleted
                              db_ref.ref('raid-events').on('child_removed',(snapshot)=>{
                                $("#"+snapshot.key).remove();
                              });

                              //When an event gets added
                              db_ref.ref('raid-events').on('child_added',(snapshot)=>{

                                let e_key = snapshot.key;
                                let e = snapshot.val();

                                if($("#"+e_key).length > 0){ return; }

                                db_ref.ref('users').orderByChild('email')
                                                   .equalTo(e.creator)
                                                   .once('value')
                                                   .then((host)=>{
                                                       $.each(host.val(),(uid,user_data)=>{
                                                        $("#accordion").append(BuildCalendarEntry(snapshot, uid, user_data));

                                                        if(uid === auth_ref.uid){
                                                          $("#"+e_key+" .rsvp-status").addClass("btn-warning").removeClass("btn-success").text("Edit");
                                                        }

                                                        $("#"+e_key+" input:eq(0)").attr('value',moment(e.startTime).format('YYYY-MM-DDTHH:mm'));

                                                        $("#"+e_key+" input:eq(1)").val(e.title);

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
                                                                                                     $("#"+e_key+" .list-group-item").append(AddUserToEvent(e_key,p_key,p));

                                                                                                     let host_uid =  $("#"+e_key + " .raid-host").attr('class').split(' ')[1];

                                                                                                     if(auth_ref.uid === u_key && u_key != host_uid)
                                                                                                     {
                                                                                                       $("#"+e_key + " .rsvp-status").addClass("btn-danger").removeClass("btn-success").text("Cancel");
                                                                                                     }
                                                                                                  });
                                                                      });
                                                                    });
                              });
                           });
}
