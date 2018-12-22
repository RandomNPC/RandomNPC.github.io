$(document).ready(function(){
  const teleports = [
                    //Lodestones
                    "Lumbridge Lodestone",
                    "Buthrope Lodestone",
                    "Lunar Isle Lodestone",
                    "Bandit Camp Lodestone",
                    "Taverly Lodestone",
                    "Al Kharid Lodestone",
                    "Varrock Lodestone",
                    "Edgeville Lodestone",
                    "Falador Lodestone",
                    "Port Sarim Lodestone",
                    "Draynor Village Lodestone",
                    "Ardougne Lodestone",
                    "Catherby Lodestone",
                    "Yannile Lodestone",
                    "Seers' Village Lodestone",
                    "Eagles' Peak Lodestone",
                    "Tirannwn Lodestone",
                    "Oo'glog Lodestone",
                    "Karamja Lodestone",
                    "Canifis Lodestone",
                    "Wilderness Volcano Lodestone",
                    "Fremmnik Province Lodestone",
                    "Menaphos Lodestone",
                    //Items
                    "Ectophial",
                    "Charter Ship",
                    "Juju Teleport Spiritbag",
                    //Duel Ring
                    "Dueling Ring: Castle Wars",
                    "Dueling Ring: South Feldip Hills",
                    "Dueling Ring: Al Kharid Duel Arena",
                    "Dueling Ring: Fist of Guthix",
                    //Games Necklace
                    "Games Necklace: Barbarian Outpost",
                    "Games Necklace: Gamers Grotto",
                    "Games Necklace: Corporeal Beast",
                    "Games Necklace: Tears Of Guthix",
                    "Games Necklace: Troll Invasion",
                    //Glory
                    "Amulet of Glory: Edgeville",
                    "Amulet of Glory: Draynor Village",
                    "Amulet of Glory: Karamja",
                    "Amulet of Glory: Al Kharid",
                    //Ring of Wealth
                    "Ring of Wealth: Grand Exchange",
                    "Ring of Wealth: Miscellenia",
                    //Wicked Hood
                    "Wicked Hood: Air Altar",
                    "Wicked Hood: Earth Altar",
                    "Wicked Hood: Fire Altar",
                    "Wicked Hood: Water Altar",
                    "Wicked Hood: Chaos Altar",
                    "Wicked Hood: Mind Altar",
                    "Wicked Hood: Body Altar",
                    "Wicked Hood: Death Altar",
                    "Wicked Hood: Nature Altar",
                    "Wicked Hood: Soul Altar",
                    "Wicked Hood: Law Altar",
                    "Wicked Hood: Astral Altar",
                    "Wicked Hood: Blood Altar",
                    "Wicked Hood: Cosmic Altar",
                    //Fairy Rings
                    "Fairy Ring: ALQ - Haunted Woods",
                    "Fairy Ring: CKS - West Canifis",
                    "Fairy Ring: BKR - Mort Myre Swamp",
                    "Fairy Ring: DLQ - Nardah",
                    "Fairy Ring: BIQ - Kalphite Queen Lair",
                    "Fairy Ring: DIS - Wizards Tower",
                    "Fairy Ring: AIQ - Mudskipper Point",
                    "Fairy Ring: DKR - Edgeville",
                    "Fairy Ring: DKP - East Karamja",
                    "Fairy Ring: CKR - Central Karamja",
                    "Fairy Ring: AKS - Feldip Hills",
                    "Fairy Ring: CIQ - Yannile",
                    "Fairy Ring: BKP - South Castle Wars",
                    "Fairy Ring: CIP - Miscellenia",
                    "Fairy Ring: AKQ - Piscatoris",
                    "Fairy Ring: ALS - McGrubors Woods",
                    //Group teleport
                    "Group Teleport - Barbarian Outpost",
                    "Group Teleport - Ice Plateau",
                    "Group Teleport - Port Khazard",
                    "Group Teleport - Fishing Guild",
                    "Ape Atoll Teleport",
                    "Lletya Teleport",
                  ];

  firebase.initializeApp({
    apiKey: "AIzaSyBO9Q0XQReiTqBiVuamOQW07IAxUESkYQ0",
    authDomain: "runscape-route.firebaseapp.com",
    databaseURL: "https://runscape-route.firebaseio.com",
    projectId: "runscape-route",
    storageBucket: "runscape-route.appspot.com",
    messagingSenderId: "1051890066655"
  });


  new ClipboardJS(`#copy-imgur,#copy-rs,#copy-text`);

  function Generate()
  {
    let selected = $.map($(`.selected`),x=>$(x).find(`p,input`))
                    .map(k=>[$(k[0]).text(),$(k[1]).val()])

    $(`#route`).empty();

    selected.forEach((k,v)=>$(`#route`).append(
      `<li>
        <div class="circle bg-circle ${k[0].match(/\w+$/g)[0].toLowerCase()}">
          <div class="line"></div>
          <p>${v+1}</p>
        </div>
        <div>
          <p>${k[0]}</p>
          <p>${k[1]}</p>
        </div>
      </li>`
    ))

    $(`#copy-text`).attr(`data-clipboard-text`,selected.map((k,v)=>`${v+1}. [gold]${k[0]}[/gold]\n ${(k[1].length>0)?`[i]via ${k[1]}[/i]\n`:`${k[1]}`}\n`).join(``));

    UpdateLink();
  }

  function UpdateLink()
  {
    html2canvas(document.getElementById("route"),{
                  allowTaint:true,
                  useCORS: true,
                  logging: false,
                })
                .then(canvas=>localStorage.setItem("image",canvas.toDataURL('image/jpeg', 0.9).split(',')[1]))
                .catch(err=>console.log(err));
  }

  firebase.database()
          .ref()
          .orderByChild(`position`)
          .once(`value`)
          .then(x=>{
            $(`#list`).empty();
            x.forEach(k=>{
              if(k.val().used){
                $(`#list`).append(
                  `<li id="${k.key}" class="selected">
                     <p>${k.val().name}</p>
                     <input type="text"></input>
                   </li>`
                )
              }
              else {
                $(`#list`).append(
                  `<li id="${k.key}">
                     <p>${k.val().name}</p>
                     <input type="text"></input>
                   </li>`
                 )
              }
              $(`#list > li:last-child input`).val(k.val().text)
            })

            Generate();
          })

  firebase.database().ref().on('child_changed',x=>{
    firebase.database()
            .ref()
            .orderByChild(`position`)
            .once(`value`)
            .then(x=>{
              $(`#list`).empty();
              x.forEach(k=>{
                if(k.val().used){
                  $(`#list`).append(
                    `<li id="${k.key}" class="selected">
                       <p>${k.val().name}</p>
                       <input type="text"></input>
                     </li>`
                  )
                }
                else {
                  $(`#list`).append(
                    `<li id="${k.key}">
                       <p>${k.val().name}</p>
                       <input type="text"></input>
                     </li>`
                   )
                }
                $(`#list > li:last-child input`).val(k.val().text)
              })

              Generate();
            })
  })

  $(`#list`).sortable({
    update: function( event, ui ) {
      let update = {};

      $.map($(`#list li`),x=>parseInt($(x).attr(`id`)))
       .forEach((x,i)=>{
         update[`${x}/position`]=i;
       })
      firebase.database()
              .ref()
              .update(update)

      Generate();
    }
  });

  $(`#reset`).click(function(){
    firebase.database()
            .ref()
            .once(`value`)
            .then(x=>{
              let update = {};
              x.val().map((k,v)=>v)
                     .forEach((k,v)=>{
                       update[`${v}/position`] = k;
                       update[`${v}/text`] = "";
                     })
              return firebase.database().ref().update(update);
            })
            .catch(err=>console.log(err))
  })

  $(`#list`).on(`change`,function(){
    let data = {};
    $(`#list input`).toArray()
                    .map((x,i)=>{return {
                      id: parseInt($(`#list li:eq(${i})`).attr(`id`)),
                      text: $(x).val(),
                    }})
                    .sort((x,i)=>x.id-i.id)
                    .forEach(x=>{
                      data[`${x.id}/text`] = x.text;
                    })
    firebase.database().ref().update(data)
  })

  $("#list").on("focusin","input",function(){
    var $target = $(this);

    if($target.is("input")){
      $target.autocomplete(
        {
          source: teleports,
          select: function( event, ui ) {
            $target.val(ui.item.label,event)
            Generate();
          }
        }
      );
    }
  });

  $("#post").click(function(){

    $.ajax({
     url: 'https://api.imgur.com/3/image',
     type: 'POST',
     headers: {
       Authorization: 'Client-ID ' + '2a084be43ea3a8b',
       Accept: 'application/json'
     },
     data: {
       image: localStorage.getItem("image"),
     },
     success: function(result) {
       $("#link-imgur").val(`https://imgur.com/${result.data.id}`);
       $("#link-rs").val(`[imgur src=${result.data.id}.png]`)
       $(`#copy-imgur`).attr(`data-clipboard-text`,`https://imgur.com/${result.data.id}`);
       $(`#copy-rs`).attr(`data-clipboard-text`,`[imgur src=${result.data.id}.png]`);
     }
    });

  });

  $(`#sort`).click(function(){
    let arr = Array($(`#list li`).length).fill(0).map((x,i)=>i);

    let list = $(`#list li.selected`).toArray()
                                     .map(x=>$(x).attr(`id`))
                                     .map(x=>parseInt(x))

    let not_list = $(`#list li:not(.selected)`).toArray()
                                             .map(x=>$(x).attr(`id`))
                                             .map(x=>parseInt(x))
                                             .sort((a,b)=>a-b)

    let data = {};
    let sorted = [...list,...not_list].forEach((x,i)=>{
                                        data[`${x}/position`]=i;
                                      })

    firebase.database().ref().update(data);
  })

})
