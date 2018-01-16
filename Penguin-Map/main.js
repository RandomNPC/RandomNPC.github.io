const API_KEY = "AIzaSyDkC-bMPs5LSQF1Wqukx1EheLmGQgO0elk";
const SPREADSHEET_ID = "1daB2uGhejLaeIbNgYvdAOruu9Tr0bu2uOonPK8cC_Ag";
const BASE_SITE = "https://sheets.googleapis.com/v4/spreadsheets/";

$(document).ready(function(){
  let map = L.map('map').setView([0,0],4);

  L.tileLayer(`http://www.runeslayer.com/maps/world/6-25-2013/{z}/{x}/{y}.png`,
  {
    tms: true,
    errorTileUrl: "http://www.maptiler.org/img/none.png",
    minZoom: 3,
    maxZoom: 8,
    continousWorld: false,
    maxBoundsViscosity: 1.0,
    noWrap: true,
  }).addTo(map);
  let bounds = [[-100,3],[-21,-180]];

  map.setMaxBounds(bounds);
  map.on('drag', function() {
  	map.panInsideBounds(bounds, { animate: false });
  });

  firebase.initializeApp(
    {
      apiKey: "AIzaSyB42PW3MwrtNhxuAVUgGYFdDfjiVCqNpJ0",
      authDomain: "penguin-confirm.firebaseapp.com",
      databaseURL: "https://penguin-confirm.firebaseio.com",
      projectId: "penguin-confirm",
      storageBucket: "penguin-confirm.appspot.com",
      messagingSenderId: "124831971002"
    }
  );

  let markers = L.layerGroup().addTo(map);
  let marker_data = [];
  firebase.database().ref('penguins').on('value',
  data=>{
    marker_data = [];
    markers.clearLayers();
    data.val().forEach((iter,iter_index)=>{
      if(iter_index < 11)
      {
        if(iter.confirm)
        {
          //one entry
          let confirm = iter.entries[iter.index];
          marker_data.push({
            strand: (iter_index < 10) ? (iter_index % 5) + 1 : 6,
            option: iter.index,
            name: confirm.descriptor,
            id: confirm.index,
            coords: [confirm.coordinates.x,confirm.coordinates.y],
            complement: null,
            marker_index: marker_data.length,
          });
        }
        else
        {
          //both entries
          let marker_length = 0;
          iter.entries.forEach((sel,sel_index)=>{
            marker_length = marker_data.push({
              strand: (iter_index < 10) ? (iter_index % 5) + 1 : 6,
              option: sel_index,
              name: sel.descriptor,
              id: sel.index,
              coords: [sel.coordinates.x,sel.coordinates.y],
              complement: null,
              marker_index: marker_data.length,
            });
          });
          //last two indexes
          marker_data[marker_length-1].complement = marker_data[marker_length-2];
          marker_data[marker_length-2].complement = marker_data[marker_length-1];
        }
      }
    });
    marker_data.forEach(p=>{
      MarkLocation(parseFloat(p.coords[1]),parseFloat(p.coords[0]),p);
    });

    function MarkLocation(x,y,p){
        let format = `<h4>${p.name}</h4>`;
        if(p.complement != null)
        {
          format+=`Alternate: <a id="${p.complement.marker_index}">${p.complement.name}</a>`;
        }

        let disguise_map =
        {
          "rock": {
            url: 'rock.png',
            size: [25,29],
          },
          "barrel":{
            url: 'barrel.png',
            size: [25,45],
          },
          "bush":{
            url: 'bush.png',
            size: [25,30],
          },
          "cactus":{
            url: 'cactus.png',
            size: [25,30],
          },
          "toadstool":{
            url: 'toadstool.png',
            size: [25,29],
          },
          "crate":{
            url: 'crate.png',
            size: [25,31],
          },
        };

        let icon_disguise = disguise_map[`${p.name.match(/(\w+)$/g)[0].toLowerCase()}`];

        let custom_icon = L.icon({
          iconUrl: icon_disguise.url,
          iconSize: icon_disguise.size,
        });
        let m = L.marker([y,x],{icon: custom_icon}).addTo(map).bindPopup(format);
        markers.addLayer(m);
    }

  },
  error=>{
    console.log("Database couldn't update on Value")
  });

  $("body").on('click','a',function(){
    let alt_index = $(this)[0].id;
    map.panTo([marker_data[alt_index].coords[0],marker_data[alt_index].coords[1]]);
  })
});
