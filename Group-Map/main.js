$(document).ready(function(){

  firebase.initializeApp({
    apiKey: "AIzaSyAyZBzeDXYxGUmP93INZaz6EiJAzLyqjiQ",
    authDomain: "world-map-188815.firebaseapp.com",
    databaseURL: "https://world-map-188815.firebaseio.com",
    projectId: "world-map-188815",
    storageBucket: "",
    messagingSenderId: "522535743470"
  });

  let uluru = {lat: 42.3601, lng: -71.0589};
  let map = new google.maps.Map(document.getElementById('map'), {
    zoom: 12,
    center: uluru,
    disableDoubleClickZoom: true,
  });

  let markers = {};
  let ref = firebase.database().ref('points');
  let directionsDisplay = new google.maps.DirectionsRenderer;
  let directionsService = new google.maps.DirectionsService;

  directionsDisplay.setMap(map);

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
          content: `<h1>${point.val().content}</h1>
                    <div id="${point.key}">
                      <button>Edit</button>
                      <button>Delete</button>
                      <select>
                        <option value="Direction To">Direction To</option>
                      </select>
                    </div>`,
        });

        marker.addListener('click', function() {

          let $content_ref = $(marker.infowindow.getContent());
          let content_name = $($content_ref[0]).text();
          let content_id = $content_ref[2].id;

          firebase.database().ref(`points`).once('value').then(snap=>{
            let html_content = `<p>${content_name}</p>
                                <div id="${content_id}">
                                  <button>Edit</button>
                                  <button>Delete</button>
                                  <select>
                                    <option value="Direction To">Direction To</option>
                                  `;
            snap.forEach(entry=>{
              let info = entry.val();
              if(entry.key != content_id){
                html_content += `<option value="${entry.key}">${info.content}</option>`;
              }
            })

            html_content += `</select></div>`;
            marker.infowindow.setContent(html_content);
          });



          marker.infowindow.open(map, marker);
        });

        markers[point.key] = marker;
        $(`#list`).append(`<li id="${point.key}">${point.val().content}</li>`)
    },
    error=>{}
  );

  ref.on('child_removed',
    point=>{
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
        content: `<h1>${point.val().content}</h1>
                  <div id="${point.key}">
                    <button>Edit</button>
                    <button>Delete</button>
                    <select>
                      <option value="Direction To">Direction To</option>
                    </select>
                  </div>`,
      });

      marker.addListener('click', function() {

        let $content_ref = $(marker.infowindow.getContent());
        let content_name = $($content_ref[0]).text();
        let content_id = $content_ref[2].id;

        firebase.database().ref(`points`).once('value').then(snap=>{
          let html_content = `<p>${content_name}</p>
                              <div id="${content_id}">
                                <button>Edit</button>
                                <button>Delete</button>
                                <select>
                                  <option value="Direction To">Direction To</option>
                                `;
          snap.forEach(entry=>{
            let info = entry.val();
            if(entry.key != content_id){
              html_content += `<option value="${entry.key}">${info.content}</option>`;
            }
          })

          html_content += `</select></div>`;
          marker.infowindow.setContent(html_content);
        });



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
  });

  $("body").on('click',"button",function(){
    let index = $.inArray(this,$(this).parent().children());
    let key = $(this).parent()[0].id;

    switch(index)
    {
      case 0: //Edit Option
          let change_text = prompt('Change Text');
          firebase.database().ref(`points/${key}`).update({
            content: change_text,
          });
        break;
      case 1: //Delete Option
          firebase.database().ref(`points/${key}`).remove();
        break;
    }
  })

  $("body").on('change',"select",function(){
    let location_id = $(this).val();
    let location_origin = $(this).parents()[0].id;
    let location_index = $.inArray(location_id,$.map($(this).find('option'),options=>{return options.value;}));

    if(location_index <= 0 || $(this).parents()[0].id === "")
    {
      return;
    }

    GeneratePath(location_origin,location_id);
  });

  function GetPoint(coord){
    return new Promise((resolve,reject)=>{
      firebase.database().ref(`points/${coord}`).once('value')
                         .then(coord=>{
                           let loc = coord.val();
                           resolve({
                             lat: loc.lat,
                             lng: loc.lng,
                           });
                         })
                         .catch(error=>{
                           reject(error);
                         });
    });
  }

  function GeneratePath(origin,destination)
  {
    return new Promise((resolve,reject)=>{
      Promise.all([GetPoint(origin),GetPoint(destination)])
      .then(data=>{

        let query = {
          origin: data[0],
          destination: data[1],
          travelMode: $(`#mode`).val(),
          transitOptions:
          {
            modes: ["RAIL"],
            routingPreference: "FEWER_TRANSFERS",
          }
        }

        directionsService.route(query, function(response, status) {
          if (status == 'OK') {
            directionsDisplay.setDirections(response);
            $(`#time`).text(response.routes[0].legs[0].duration.text);
            resolve();
          } else {
            reject();
          }
        });
      })
      .catch(error=>{
        console.log(error)
        reject(error);
      })
    });

  }


  $(`#list`).on('click',"li",function(){
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
