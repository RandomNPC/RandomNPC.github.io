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
    $("#main-settings").toggleClass("hidden",true);
    $("#main-create-event").toggleClass("hidden",false);
    $("#main-create-event input:eq(0)").attr('value',moment(new Date().getTime()).format('YYYY-MM-DDTHH:mm'));
  });

  //Settings Button
  $("#main-screen nav .nav-link:eq(3)").click(function(){
    $("#main-content").toggleClass("hidden",true);
    $("#main-settings").toggleClass("hidden",false);
    $("#main-create-event").toggleClass("hidden",true);
  });

  //Log Out Button
  $("#main-screen nav .nav-link:eq(4)").click(function(){
    gapi.auth2.getAuthInstance().signOut();
    location.reload();
  });

  //Settings: Change screenname
  $("#main-settings button:eq(0)").click(function(){
    var response = $("#main-settings input:eq(0)").val().replace(/\W|script/g,"");

    var user = firebase.auth().currentUser;
    var user_ref = firebase.database().ref('users').child(user.uid);

    user_ref.update({
      name: response,
      image: $("#user-image").attr("src"),
    });
  });

  //Settings: Change Image
  $("#main-settings input:eq(1)").on("change", function(e){
    let file = e.target.files[0];

    if(file.name.search(/(jpg|png|jpeg)/g) < 0){
      //invalid file dont work with it
      return;
    }

    let storage_ref = firebase.storage().ref(firebase.auth().currentUser.uid+"/profile"+file.name.match(/\..+/g)[0]);
    let task = storage_ref.put(file);
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
          creator: firebase.auth().currentUser.uid,
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
          creator: firebase.auth().currentUser.uid,
          title: event_title,
          description: "",
        });
      });

      $("#main-content").toggleClass("hidden",false);
      $("#main-settings").toggleClass("hidden",true);
      $("#main-create-event").toggleClass("hidden",true);
    });

  });

});

function BuildCalendarEntry(event_id,time,title,host,host_uid){

  return '<div id="'+event_id+'" class="card '+time+'">' +
            '<div class="card-header" role="tab">' +
              '<div class="collapsed" data-toggle="" data-parent="#accordion" aria-expanded="false">' +
                '<div class="container-fluid">' +
                 '<div class="row">' +
                   '<div class="col-3">' +
                     '<div class="row">' +
                       '<div class="col-xs-12">' +
                          '<p class="week-name">'+moment(time).format('dddd')+'</p>' +
                       '</div>' +
                     '</div>' +
                     '<div class="row">' +
                       '<div class="col-xs-2">' +
                          '<p class="month-name">'+moment(time).format("MMM")+'</p>' +
                       '</div>' +
                        '<div class="col-xs-8"></div>' +
                       '<div class="col-xs-2">' +
                          '<p class="day-month">'+moment(time).format("Do")+'</p>' +
                       '</div>' +
                     '</div>' +
                   '</div>' +
                   '<div class="col-6">' +
                     '<div class="row">' +
                       '<div class="col-xs-12">' +
                          '<p class="raid-title">'+title+'</p>' +
                       '</div>' +
                     '</div>' +
                     '<div class="row">' +
                       '<div class="col-xs-5">' +
                          '<p class="raid-time">'+ moment(time).format('LT') +'</p>' +
                       '</div>' +
                        '<div class="col-xs-2">' +
                          '<p style="margin-right:0px;">by</p>' +
                       '</div>' +
                       '<div class="col-xs-5">' +
                          '<p class="raid-host '+host_uid+'">'+ host +'</p>' +
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

function AddUserToEvent(attendee_uid,image,name){
  return '<div class="col-12 container-fluid">' +
            '<div class="row">' + //justify-content-center
              '<img class="'+attendee_uid+'" src="'+image+'">' +
              '<p class="'+attendee_uid+'">'+name+'</p>' +
            '</div>' +
          '</div>';
}

function getAttendeeData(key){
  return new Promise(function(resolve,reject){
    firebase.database().ref('users/'+key).once('value').then(res=>{
      let user =
      {
        user_id: key,
        name: res.val().name,
        image: res.val().image,
      };
      resolve(user);
    }).catch(err=>{
      reject(err);
    });
  });
}

function getAttendees(event_id){
  return new Promise(function(resolve,reject){

    firebase.database().ref('raid-attendees/'+event_id)
                       .once('value')
                       .then(a_uid=>{
                         let promise = [];
                         a_uid.forEach(attendee=>{
                           promise.push(getAttendeeData(attendee.key));
                         });

                         Promise.all(promise).then(attendees=>{
                           resolve(attendees);
                         }).catch(err=>{
                           reject(err);
                         });
                       }).catch(error=>{
                         reject(error);
                       });
  });
}

function getHost(uid){
  return new Promise(function(resolve,reject){
    firebase.database().ref('users/'+uid)
                       .once('value')
                       .then(host=>{
                         resolve(host);
                       }).catch(error=>{
                         reject(error);
                       });
  });
}

function StartApplication()
{
  let auth_ref = firebase.auth().currentUser;
  let db_ref = firebase.database();

  $("#login-screen").toggleClass("hidden",true);
  $("#main-screen").toggleClass("hidden",false);

  //get user profile
  db_ref.ref('users').once('value').then((result)=>{

    if(result.hasChild(auth_ref.uid))
    {
      let profile = result.child(auth_ref.uid).val();
      $("#user-image, #settings-image").attr("src",profile.image);
      $.map($("#user-name, #settings-name"),(v)=>{$(v).text(profile.name);});
      $("#main-settings input:eq(0)").val(profile.name);
    }
    else {
      db_ref.ref('users/'+auth_ref.uid).update({
        name: auth_ref.displayName,
        image: auth_ref.photoURL,
      }).then((result)=>{
        $("#user-image, #settings-image").attr("src",auth_ref.photoURL);
        $.map($("#user-name, #settings-name"),(v)=>{$(v).text(auth_ref.displayName);});
        $("#main-settings input:eq(0)").val(auth_ref.displayName);
      });
    }
  });

  //When an event gets added/initial add
  db_ref.ref('raid-events').on('child_added',(snapshot)=>{
    if($("#"+snapshot.key).length > 0){return;}
    let e = snapshot.val();

    getHost(e.creator).then(host=>{
      let host_name = host.val().name;

      let $elements = $("#accordion > div");

      if($elements.length > 0)
      {
        let insertIndex = -1;

        $.each($("#accordion > div"),(index,value)=>{
            let startTime = $(value).attr('class').split(' ')[1];
            if(startTime <= e.startTime){
              insertIndex = index;
            }
        });

        if(insertIndex < 0)
        {
          $('#accordion > div:eq(0)').before(BuildCalendarEntry(snapshot.key,e.startTime,e.title,host_name,host.key));
        }
        else
        {
          $('#accordion > div:eq('+insertIndex+')').after(BuildCalendarEntry(snapshot.key,e.startTime,e.title,host_name,host.key));
        }

      }
      else{
        $("#accordion").append(BuildCalendarEntry(snapshot.key,e.startTime,e.title,host_name,host.key));
      }

      $("#"+snapshot.key+" input:eq(0)").attr('value',moment(e.startTime).format('YYYY-MM-DDTHH:mm'));
      $("#"+snapshot.key+" input:eq(1)").val(e.title);

      return getAttendees(snapshot.key);
    }).then(attendees=>{
      $.map(attendees,a=>{
        $("#"+snapshot.key+" .list-group-item").append(AddUserToEvent(a.user_id,a.image,a.name));

        if(a.user_id == auth_ref.uid)
        {
          var host_id = $("#"+snapshot.key+" .raid-host").attr('class').split(' ')[1];
          if(host_id == auth_ref.uid)
          {
            //Host, edit settings
            $("#"+snapshot.key+" .rsvp-status").addClass("btn-warning").removeClass("btn-success").text("Edit");
          }
          else{
            //Attendee, set to decline
            $("#"+ snapshot.key + " .rsvp-status").addClass("btn-danger").removeClass("btn-success").text("Cancel");
          }
        }
      });
    }).catch(err=>{
      console.log(err);
    }).catch(error=>{
      console.log(error)
    });
  });

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
       getAttendeeData(delta_uid).then(result=>{
                                  $("#"+event_id+" .list-group-item").append(AddUserToEvent(result.user_id,result.image,result.name));
                                  //Attendee, set to decline
                                  if(result.user_id === auth_ref.uid)
                                  {
                                    $("#"+ event_id + " .rsvp-status").addClass("btn-danger").removeClass("btn-success").text("Cancel");
                                  }
                               }).catch(error=>{
                                   console.log(error);
                               });
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

  //When a player changes their profile
  db_ref.ref('users').on('child_changed',(snapshot)=>{

    let u_key = snapshot.key;
    let u = snapshot.val();

    //Name change
    $.map($("."+u_key),(element)=>{$(element).text(u.name);});

    $("img."+u_key).attr('src',u.image);

    if(snapshot.key === auth_ref.uid)
    {
      $("#user-name").text(u.name);
      $("#settings-name").text(u.name);
      $("#user-image").attr("src",u.image);
      $("#settings-image").attr("src",u.image);
    }
  });
}
