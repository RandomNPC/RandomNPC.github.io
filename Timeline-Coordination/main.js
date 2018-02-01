$(document).ready(function(){

  firebase.initializeApp({
    apiKey: "AIzaSyBE4giKWHZLVNLQtiREpPOQvXk63GjhBFo",
    authDomain: "flight-timeline.firebaseapp.com",
    databaseURL: "https://flight-timeline.firebaseio.com",
    projectId: "flight-timeline",
    storageBucket: "",
    messagingSenderId: "473837265855"
  });

  // Configuration for the Timeline
  var options = {
    editable: false,
    start: new Date("5-11-2018"),
    end: new Date("5-25-2018"),
    moveable: true,
    moment: function (date) {
      return vis.moment(date).utc();
    },
    format:{
      minorLabels:
      {
        hour: `h:mm A`
      }
    }
  };

  let items = new vis.DataSet({});

  // Create a Timeline
  let timeline = new vis.Timeline(document.getElementById('canvas'), items, options);
  let uid = -1;

  // Create a DataSet (allows two way data-binding)
  let stuff = `
              <h5>Paul</h5>
              <div>Alaska 1352 SFO-BOS</div>
              <div>9:20 AM PST - 6:15 PM EST</div>
              `;

  firebase.database().ref('entry').on(`value`,e=>{
    let flight_itenerary = [];
    e.forEach(d=>{
      let entry = d.val();
      let key = d.key;
      let content = `
                  <h5>${entry.flight_name}</h5>
                  <div>${entry.flight_no} ${entry.flight_origin}-${entry.flight_dest}</div>
                  <div>${vis.moment(entry.flight_depart).format("hh:mm A")}-${vis.moment(entry.flight_arr).format("hh:mm A")}</div>
                  `;
      flight_itenerary.push({
        id: key,
        content: content,
        start: new Date(entry.flight_depart),
        end: new Date(entry.flight_arr),
      });
    });
    timeline.setData({
      items: flight_itenerary,
    })

  },error=>{});

  //When entry is selected on Timeline
  timeline.on('select', function (prop) {
    if(prop.items.length <= 0){
      uid = -1;
      return;
    }
    uid = prop.items[0];
    //Populate items
    firebase.database().ref(`entry/${uid}`).once('value')
    .then(e=>{
      let data = e.val();
      $(`#flight_name`).val(data.flight_name);
      $(`#flight_no`).val(data.flight_no);
      $(`#flight_origin`).val(data.flight_origin);
      $(`#flight_depart`).val(data.flight_depart);
      $(`#flight_depart_tz`).val(data.flight_depart_tz);
      $(`#flight_dest`).val(data.flight_dest);
      $(`#flight_arr`).val(data.flight_arr);
      $(`#flight_arr_tz`).val(data.flight_arr_tz);
      $(`#drive_name`).val(data.drive_name);
      $(`#drive_arrive`).val(data.drive_arrive);
    })
    .catch(err=>{console.log("No content found");})
  });

  $(`#add`).click(function(){
    firebase.database().ref(`entry`).push({
      flight_name: $(`#flight_name`).val(),
      flight_no: $(`#flight_no`).val(),
      flight_origin: $(`#flight_origin`).val(),
      flight_depart: $(`#flight_depart`).val(),
      flight_depart_tz: $(`#flight_depart_tz`).val(),
      flight_dest: $(`#flight_dest`).val(),
      flight_arr: $(`#flight_arr`).val(),
      flight_arr_tz: $(`#flight_arr_tz`).val(),
      drive_name: $(`#drive_name`).val(),
      drive_arrive: $(`#drive_arrive`).val(),
    })
  })
  $(`#remove`).click(function(){
    console.log("remove")
    firebase.database().ref(`entry/${uid}`).remove().then(e=>{
      uid = -1;
    }).catch(err=>{});
  })
  $(`#update`).click(function(){
    console.log("update")
    console.log($(`#flight_depart`).val())
    firebase.database().ref(`entry/${uid}`).update({
      flight_name: $(`#flight_name`).val(),
      flight_no: $(`#flight_no`).val(),
      flight_origin: $(`#flight_origin`).val(),
      flight_depart: $(`#flight_depart`).val(),
      flight_depart_tz: $(`#flight_depart_tz`).val(),
      flight_dest: $(`#flight_dest`).val(),
      flight_arr: $(`#flight_arr`).val(),
      flight_arr_tz: $(`#flight_arr_tz`).val(),
      drive_name: $(`#drive_name`).val(),
      drive_arrive: $(`#drive_arrive`).val(),
    })
  })
});
