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
        let infowindow = new google.maps.InfoWindow({
          content: `<p>${point.val().content}</p>
                    <div id="${point.key}">
                      <button>Edit</button>
                      <button>Delete</button>
                    </div>`,
        });

        let marker = new google.maps.Marker({
          position: {
            lat: point.val().lat,
            lng: point.val().lng,
          },
          map: map,
          icon: `point.png`,
        });
        marker.addListener('click', function() {
          infowindow.open(map, marker);
        });

        markers[point.key] = marker;
    },
    error=>{}
  );

  ref.on('child_removed',
    point=>{
      markers[point.key].setMap(null);
      markers[point.key] = null;
    },
    error=>{}
  );

  ref.on('child_changed',
    point=>{
      markers[point.key].setMap(null);
      markers[point.key] = null;

      let infowindow = new google.maps.InfoWindow({
        content: `<p>${point.val().content}</p>
                  <div id="${point.key}">
                    <button>Edit</button>
                    <button>Delete</button>
                  </div>`,
      });

      let marker = new google.maps.Marker({
        position: {
          lat: point.val().lat,
          lng: point.val().lng,
        },
        map: map,
        icon: `point.png`,
      });

      marker.addListener('click', function() {
        infowindow.open(map, marker);
      });

      markers[point.key] = marker;

    },
    error=>{}
  );

  map.addListener('dblclick',(e)=>{
    let key = ref.push().key;
    firebase.database().ref(`points/${key}`).update({
      lat: e.latLng.lat(),
      lng: e.latLng.lng(),
      content: prompt('Add Text'),
    })

  });

  $("body").on('click',"button",function(){
    let index = $.inArray(this,$(this).parent().children());
    let key = $(this).parent()[0].id;
    switch(index)
    {
      case 0: //Edit Option
          firebase.database().ref(`points/${key}`).update({
            content: prompt('Change Text'),
          });
        break;
      case 1: //Delete Option
          firebase.database().ref(`points/${key}`).remove();
        break;
    }
  })

});
