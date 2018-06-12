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
                    "Dueling Ring: Mobilising Armies",
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
                  ];

  var config = {
    apiKey: "AIzaSyD1-dRhKYn21pfoi5W1VfJKAajse9pVASY",
    authDomain: "runescape-penguins.firebaseapp.com",
    databaseURL: "https://runescape-penguins.firebaseio.com",
    projectId: "runescape-penguins",
    storageBucket: "runescape-penguins.appspot.com",
    messagingSenderId: "433845323729"
  };
  firebase.initializeApp(config);

  new ClipboardJS(`#copy-imgur,#copy-rs`);

  function Display(x)
  {
    let indicies = x.val().map(k=>k.index)
    let options = x.val().map(k=>k.options.map(p=>p.name))
                         .map((k,v)=>{
                           if(v===5){
                             return k.map(p=>p.filter((s,t)=>t>0));
                           }else {
                             return k;
                           }
                         })

    $(`#list`).empty();

    options.map((k,v)=>k.map((p,q)=>p.map(s=>{return {name: s,target: q==indicies[v]}})))
           .map(k=>k.reduce((p,q)=>p.concat(q),[]))
           .reduce((k,v)=>k.concat(v),[])
           .forEach((k,v)=>{
             if(k.target){
               $(`#list`).append(
                 `<li id="${v}" class="selected">
                    <p>${k.name}</p>
                    <input type="text"></input>
                  </li>`
               )
             }
             else {
               $(`#list`).append(
                 `<li id="${v}">
                    <p>${k.name}</p>
                    <input type="text"></input>
                  </li>`
                )
             }
           })
      let order = localStorage.getItem("order");

      if(order===`null` || order ===null){
        let save = JSON.stringify($.map($(`#list li`),x=>{return {id:$(x).attr(`id`),label: $(x).find('input').val()}}))
        localStorage.setItem("order",save)
        Generate();
        return;
      }

      let content =
      JSON.parse(order)
          .map(k=>{
            $(`#list #${k.id} input`).val(k.label)
            return $(`#list #${k.id}`).clone()
          })

      $(`#list`).empty();

      content.forEach(k=>$(`#list`).append(k))
      Generate();
  }

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

    UpdateLink();
  }

  function UpdateLink()
  {
    html2canvas(document.getElementById("route"),{
                  allowTaint:true,
                  useCORS: true,
                })
                .then(canvas=>localStorage.setItem("image",canvas.toDataURL('image/jpeg', 0.9).split(',')[1]))
                .catch(err=>console.log(err));
  }

  firebase.database().ref().limitToLast(1).on('child_added',x=>Display(x))

  firebase.database().ref().on('child_changed',x=>{

    if(x.val().every(k=>!isNaN(k))){
      return;
    }
    Display(x);
  })

  $(`#list`).sortable({
    update: function( event, ui ) {
      let save = JSON.stringify($.map($(`#list li`),x=>{return {id:$(x).attr(`id`),label: $(x).find('input').val()}}))
      localStorage.setItem("order",save)
      Generate();
    }
  });

  $(`#reset`).click(function(){
    localStorage.setItem("order",null)
    firebase.database().ref().limitToLast(1).once('value')
                                            .then(x=>firebase.database().ref(Object.keys(x.val())[0]).once('value'))
                                            .catch(err=>console.log(err))
                                            .then(x=>Display(x))
  })

  $(`#list`).on(`input`,function(){
    Generate();
  })

  $("#list").on("focusin","input",function(){
    var $target = $(this);

    if($target.is("input")){
      $target.autocomplete(
        {
          source: teleports,
          select: function( event, ui ) {
            $target.val(ui.item.label,event)
            let save = JSON.stringify($.map($(`#list li`),x=>{return {id:$(x).attr(`id`),label: $(x).find('input').val()}}))
            console.log(save)
            localStorage.setItem("order",save)
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
    let list = $(`#list li.selected`).toArray()
                                     .map(x=>[$(x).attr(`id`),$(x).find(`input`)])
                                     .map(x=>{return {id: x[0], label:$(x[1]).val()}})

    let not_list = $(`#list li:not(.selected)`).toArray()
                                             .map(x=>[$(x).attr(`id`),$(x).find(`input`)])
                                             .map(x=>{return {id: x[0], label:$(x[1]).val()}})

    localStorage.setItem("order",JSON.stringify([...list,...not_list]))

    firebase.database().ref().limitToLast(1).once('value')
                                            .then(x=>firebase.database().ref(Object.keys(x.val())[0]).once('value'))
                                            .catch(err=>console.log(err))
                                            .then(x=>Display(x))

  })

})
