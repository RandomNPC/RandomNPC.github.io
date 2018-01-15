$(document).ready(function(){

  firebase.initializeApp({
    apiKey: "AIzaSyAyZBzeDXYxGUmP93INZaz6EiJAzLyqjiQ",
    authDomain: "world-map-188815.firebaseapp.com",
    databaseURL: "https://world-map-188815.firebaseio.com",
    projectId: "world-map-188815",
    storageBucket: "",
    messagingSenderId: "522535743470"
  });

  var uluru = {lat: 42.3601, lng: -71.0589};
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 12,
    center: uluru,
    disableDoubleClickZoom: true,
  });

  let markers = {};
  let ref = firebase.database().ref('points');

  ref.on('child_added',
    point=>{
        let marker = new google.maps.Marker({
          position: {
            lat: point.val().lat,
            lng: point.val().lng,
          },
          map: map,
          icon: `point.png`,
        });

        marker.infowindow = new google.maps.InfoWindow({
          content: `<p>${point.val().content}</p>
                    <div id="${point.key}">
                      <button>Edit</button>
                      <button>Delete</button>
                    </div>`,
        });

        marker.addListener('click', function() {
          marker.infowindow.open(map, marker);
        });

        markers[point.key] = marker;
        $(`#list`).append(`<li id="${point.key}">${point.val().content}</li>`)
    },
    error=>{}
  );

  ref.on('child_removed',
    point=>{

      $(`#log`).append(`<li>Point Removed: ${point.val().content}</li>`)
      $(`#list #${point.key}`).remove();
      markers[point.key].setMap(null);
      markers[point.key] = null;
    },
    error=>{}
  );

  ref.on('child_changed',
    point=>{
      markers[point.key].setMap(null);
      markers[point.key] = null;

      let marker = new google.maps.Marker({
        position: {
          lat: point.val().lat,
          lng: point.val().lng,
        },
        map: map,
        icon: `point.png`,
      });

      marker.infowindow = new google.maps.InfoWindow({
        content: `<p>${point.val().content}</p>
                  <div id="${point.key}">
                    <button>Edit</button>
                    <button>Delete</button>
                  </div>`,
      });

      marker.addListener('click', function() {
        marker.infowindow.open(map, marker);
      });

      markers[point.key] = marker;
      $(`#list #${point.key}`).text(point.val().content);
    },
    error=>{}
  );

  map.addListener('dblclick',(e)=>{
    let key = ref.push().key;
    let text = prompt('Add Text');
    firebase.database().ref(`points/${key}`).update({
      lat: e.latLng.lat(),
      lng: e.latLng.lng(),
      content: text,
    })

    $(`#log`).append(`<li id="${key}">Point Added: ${text}</li>`)
  });

  $("body").on('click',"button",function(){
    let index = $.inArray(this,$(this).parent().children());
    let key = $(this).parent()[0].id;

    switch(index)
    {
      case 0: //Edit Option
          let change_text = prompt('Change Text');
          $(`#log`).append(`<li id="${key}">Point Remaned: ${$($(this).parents()[1].childNodes[0]).text()} > ${change_text}</li>`)
          firebase.database().ref(`points/${key}`).update({
            content: change_text,
          });
        break;
      case 1: //Delete Option
          firebase.database().ref(`points/${key}`).remove();
        break;
    }
  })

  $(`#log,#list`).on('click',"li",function(){
    let key = $(this)[0].id;
    let marker_ref = markers[key];
    if(marker_ref!=null)
    {

      for (let m in markers) {
        if(markers[m]!=null)
        {
          markers[m].infowindow.close();
        }
      }

      map.setCenter(marker_ref.getPosition());
      new google.maps.event.trigger( marker_ref, 'click' );
    }
  });
});
