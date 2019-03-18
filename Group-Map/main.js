$(document).ready(function(){

  let current_marker = null;

  firebase.initializeApp({
    apiKey: "AIzaSyBtbzM9q5Oc36xaSNxOtzGvSA__hINxUFc",
    authDomain: "map-planning-c97e1.firebaseapp.com",
    databaseURL: "https://map-planning-c97e1.firebaseio.com",
    projectId: "map-planning-c97e1",
    storageBucket: "map-planning-c97e1.appspot.com",
    messagingSenderId: "499546331206"
  });

  let uluru = {lat: 37.0902, lng: -95.7129};
  const map = new google.maps.Map(document.getElementById('map'), {
    zoom: 4,
    center: uluru,
    disableDoubleClickZoom: true,
  });

  let markers = {};
  let ref = firebase.database().ref('points');
  let directionsDisplay = new google.maps.DirectionsRenderer;
  let directionsService = new google.maps.DirectionsService;

  directionsDisplay.setMap(map);

  let input = document.getElementById('pac-input');
  let searchBox = new google.maps.places.SearchBox(input);
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

  ref.on('child_added',
    point=>{
        let marker = new google.maps.Marker({
          position: {
            lat: point.val().lat,
            lng: point.val().lng,
          },
          map: map,
          icon: point.val().type,
        });

        marker.infowindow = new google.maps.InfoWindow({
          content: `<h1>${point.val().content}</h1>
                    <div id="${point.key}">
                      <button id="deletepoint">Delete</button>
                      <select>
                        <option value="Direction To">Direction To</option>
                    </div>`,
        });

        marker.addListener('click', function() {

          let $content_ref = $(marker.infowindow.getContent());
          let content_name = $($content_ref[0]).text();
          let content_id = $content_ref[2].id;

          firebase.database().ref(`points`).once('value').then(snap=>{
            let html_content = `<p>${content_name}</p>
                                <div id="${content_id}">
                                  <button id="deletepoint">Delete</button>
                                  <select id="clickmarker">
                                    <option value="Direction To">Direction To</option>`;
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
                    <button id="deletepoint">Delete</button>
                    <select>
                      <option value="Direction To">Direction To</option>
                  </div>`,
      });

      marker.addListener('click', function() {

        let $content_ref = $(marker.infowindow.getContent());
        let content_name = $($content_ref[0]).text();
        let content_id = $content_ref[2].id;

        firebase.database().ref(`points`).once('value').then(snap=>{
          let html_content = `<p>${content_name}</p>
                              <div id="${content_id}">
                                <button id="deletepoint">Delete</button>
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

  map.addListener('dblclick',(location)=>{

    if(current_marker!=null)
    {
      current_marker.setMap(null)
    }

    const marker = new google.maps.Marker({map: map});
    marker.setPosition(location.latLng)
    const info_window = new google.maps.InfoWindow;

    current_marker = marker;

    const lat = location.latLng.lat();
    const lng = location.latLng.lng();

    info_window.setContent(
    `<input id="newtext"></input>
     <select id="pointtype">
        <option value="none" selected>None</option>
        <option value="house">House</option>
        <option value="store">Store</option>
        <option value="attraction">Attraction</option>
     </select>
     <button id="newplace">Add</button>
     <div style="display:none"; id="rc_lat">${lat}</div>
     <div style="display:none"; id="rc_lng">${lng}</div>`
    );
    info_window.open(map, current_marker);
  });

  $(`body`).on(`click`,`#newplace`,function(){
    let key = ref.push().key;
    let image = $(`#pointtype option:selected`).attr(`value`)
    if(image==="none"){
      image = "point";
    }
    firebase.database().ref(`points/${key}`).update({
      content: $(`#newtext`).val(),
      lat: parseFloat($(`#rc_lat`).text()),
      lng: parseFloat($(`#rc_lng`).text()),
      type: `${image}.png`,
    })

    current_marker.setMap(null)
  })

  searchBox.addListener('places_changed', function() {
    let point = searchBox.getPlaces()[0];
    let key = ref.push().key;
    firebase.database().ref(`points/${key}`).update({
      lat: point.geometry.location.lat(),
      lng: point.geometry.location.lng(),
      content: point.name,
    })
  });

  $("body").on('click',"#deletepoint",function(){
    firebase.database().ref(`points/${$(this).parent().attr(`id`)}`).remove();
  })

  $("body").on('change',"#clickmarker",function(){
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

  function GeneratePath(origin,destination){
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
