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
                    "Ape Atoll Teleport",
                    "Lletya Teleport",
                    //Duel Ring
                    "Dueling Ring: Castle Wars",
                    "Dueling Ring: South Feldip Hills",
                    "Dueling Ring: Al Kharid Duel Arena",
                    "Dueling Ring: Fist of Guthix",
                    //Games Necklace
                    "Games Necklace: Barbarian Outpost",
                    "Games Necklace: Gamers Grotto",
                    "Games Necklace: Corporeal Beast",
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
                    "Wicked Hood: Nature Altar",
                    "Wicked Hood: Law Altar",
                    "Wicked Hood: Astral Altar",
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
                    "Fairy Ring: BLR - Legends Guild",
                    //Glider
                    "Glider: Ta Quir Priw - The Grand Tree",
                    "Glider: Sindarpos - White Wolf Mountain",
                    "Glider: Lemanto Andra - Digsite",
                    "Glider: Kar-Hewo - Al Kharid",
                    "Glider: Gandius - East Karamja",
                    "Glider: Lemantolly Undri - Feldip Hills",
                    "Glider: Priw Gnomo Andralo - Gnome Maze",
                    //Charter
                    "Charter Ship: Port Tyras",
                    "Charter Ship: Port Khazard",
                    "Charter Ship: Brimhaven",
                    "Charter Ship: Catherby",
                    "Charter Ship: East Karamja (Shipyard)",
                    "Charter Ship: Musa Point",
                    "Charter Ship: Port Sarim",
                    "Charter Ship: Menaphos",
                    "Charter Ship: Mos Le'Harmless",
                    "Charter Ship: Port Phasmatys",
                  ];

  firebase.initializeApp({
    apiKey: "AIzaSyD1-dRhKYn21pfoi5W1VfJKAajse9pVASY",
    authDomain: "runescape-penguins.firebaseapp.com",
    databaseURL: "https://runescape-penguins.firebaseio.com",
    projectId: "runescape-penguins",
    storageBucket: "runescape-penguins.appspot.com",
    messagingSenderId: "433845323729"
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
          .ref(`routing`)
          .once(`value`)
          .then(data=>{

            $(`#list`).empty();
            const arr = data.val()

            const s_arr = Array(data.length).fill(null);

            data.forEach(x=>{
              s_arr[x.val().position] = {
                key: x.key,
                name: x.val().name,
                selected: x.val().selected,
                text: x.val().text
              }
            })

            s_arr.forEach(x=>{
              $(`#list`).append(
                `<li id="${x.key}" ${(x.selected) ? `class="selected"`: ``}>
                   <p>${x.name}</p>
                   <input type="text"></input>
                 </li>`
               )

               $(`#list > li:last-child input`).val(x.text)
            })

            Generate();
          })

  firebase.database().ref().on('child_changed',x=>{
    firebase.database()
            .ref(`routing`)
            .once(`value`)
            .then(data=>{

              $(`#list`).empty();
              const arr = data.val()

              const s_arr = Array(data.length).fill(null);

              data.forEach(x=>{
                s_arr[x.val().position] = {
                  key: x.key,
                  name: x.val().name,
                  selected: x.val().selected,
                  text: x.val().text
                }
              })

              s_arr.forEach(x=>{
                $(`#list`).append(
                  `<li id="${x.key}" ${(x.selected) ? `class="selected"`: ``}>
                     <p>${x.name}</p>
                     <input type="text"></input>
                   </li>`
                 )
                $(`#list > li:last-child input`).val(x.text)
              })

              Generate();
            })
  })

  $(`#list`).sortable({
    update: function( event, ui ) {
      const arr = {}
      $(`#list li`).toArray()
                   .forEach((x,i)=>{
                    arr[`routing/${$(x).attr(`id`)}/position`] = i;
                   })
      firebase.database().ref().update(arr)
    }
  });

  //back to original positions
  $(`#reset`).click(function(){
    firebase.database()
            .ref(`routing`)
            .once(`value`)
            .then(data=>{
              const arr = {};
              data.forEach(x=>{
                arr[`routing/${x.key}/position`] = x.val().origin_position;
              })
              return firebase.database().ref().update(arr)
            })
            .catch(err=>console.log(err))
  })

  $(`#list`).on(`change`,`input`,function(){
    let arr = {};
    const data = $(this)[0].value;
    const source = $($(this).parents()[0]).attr(`id`)

    arr[`routing/${source}/text`] = data;

    firebase.database().ref().update(arr)
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

    firebase.database()
            .ref(`routing`)
            .once(`value`)
            .then(data=>{
              const arr = {};

              const s_arr = Array(data.length).fill(null);

              data.forEach(x=>{
                s_arr[x.val().position] = {
                  key: x.key,
                  selected: x.val().selected
                }
              })

              const sort_arr = [
                s_arr.filter(x=>x.selected),
                s_arr.filter(x=>!x.selected)
              ]

              sort_arr.reduce((x,i)=>x.concat(i),[])
                      .forEach((x,i)=>{
                        arr[`routing/${x.key}/position`] = i;
                      })

              firebase.database().ref().update(arr)

            })
  })

})
