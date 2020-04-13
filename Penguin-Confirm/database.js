$(document).ready(function(){

  var config = {
    apiKey: "AIzaSyD1-dRhKYn21pfoi5W1VfJKAajse9pVASY",
    authDomain: "runescape-penguins.firebaseapp.com",
    databaseURL: "https://runescape-penguins.firebaseio.com",
    projectId: "runescape-penguins",
    storageBucket: "runescape-penguins.appspot.com",
    messagingSenderId: "433845323729"
  };
  firebase.initializeApp(config);

  new ClipboardJS(`#reddit-copy`)

  function Display(x)
  {
        let $setup_ref = $.map($(`#content-setup .card`),x=>$(x).find(`.col-5`))
                          .map(x=>$.map($(x),k=>$(k).find(`.nopadding`)))
                          .map(x=>x.map(k=>$.map($(k),p=>$(p).find('input'))))
                          .map(x=>x.map(k=>[k[0][0],k[1]]))

        x.val().filter((k,v,arr)=>v < arr.length - 1)
               .map(k=>k.options)
               .map((k,v,arr)=>{
                  if(v<arr.length-1){
                    return k;
                  }else {
                    return k.map(p=>{return {id: p.id, name: [p.name[1]]}})
                  }
               })
               .forEach((k,v)=>k.forEach((p,q)=>{

                  $($setup_ref[v][q][0]).val(`${p.id}`)
                  Object.values(p.name).forEach((s,t)=>{
                    $($setup_ref[v][q][1][t]).val(s)
                  })
               }))


        let $ref = $.map($(`#content-home .card`),x=>$(x).find(`.col-6`))
                    .map(x=>$.map($(x),k=>$(k).find(`h6`)))

        //One/Two Pointer pairs
        x.val().splice(0,6)
               .map(k=>k.options)
               .map(k=>k.map(p=>Object.values(p.name)))
               .map(x=>{
                 //console.log(x)
                 return x;
               })
               .forEach((k,v)=>k.forEach((p,q)=>p.forEach((s,t)=>{
                 if(v<5){
                   $($ref[v][q][t]).text(s)
                 }
                 else {
                   $($ref[v][q]).text(s)
                 }
               })))

        let list =
        x.val().filter((k,v)=>v<6)
               .map(k=>k.index)

        $(`.selected`).removeClass(`selected`)

        $.map($(`#content-home .card`),x=>$(x).find(`.col-6`))
         .filter(k=>k.length>0)
         .map((k,v)=>k[list[v]])
         .forEach(k=>$(k).addClass(`selected`))

         let $data =
         $($.map($(`#content-home .card`),x=>$(x).find(`.col-4`))
          .filter(k=>k.length>0)[0][x.val().filter((k,v)=>v===6)[0].index]).addClass(`selected`)
  }

  const CIRCUS =
  [
    `inside the Tree Gnome Entrance`,
    `in Seers' Village`,
    `in Catherby`,
    `in Taverley`,
    `in Edgeville`,
    `in Falador`,
    `in Rimmington`,
    `in Draynor Village`,
    `in Al Kharid`,
    `in Lumbridge`,
    `outside the Sawmill`,
    `outside of the Cook's Guild`,
  ]

  const SPECIAL_LABELS =
  [
    [[20,27],[15,27]],     //Desert
    [[],[26,33]],        //Sophanem
    [[],[4,8,11,24,31]]  //Wilderness
  ]

  Object.defineProperty(Array.prototype,`chunk`,{
    value: function(size){
      let arr = this;
      return Array(Math.ceil(arr.length / size)).fill().map((_, index) => index * size).map(begin => arr.slice(begin, begin + size))
    }
  })

  Object.defineProperty(Array.prototype,`transpose`,{
    value: function(){
      let arr = this;
      return arr.reduce((prev, next) => next.map((item, i) =>(prev[i] || []).concat(next[i])), [])
    }
  })

  function EvalDisguise(disguise){
    let index = $.inArray($(`#reddit-settings > div:nth-child(1) > div > input:checked`)[0],$(`#reddit-settings > div:nth-child(1) > div > input`))
    switch(index){
      case 0:
        return disguise;
      case 1:
        return `Pumpkin`;
      case 2:
        return `Snowman`;
      default:
        return disguise;
    }
  }

  function ParseReddit(data){

    let freezer = data.val()[5];
    let freezer_data = freezer.options[freezer.index];

    //Circus
    let circus_name = CIRCUS[data.key%12];

    //Polar Bear
    let polar_bear = data.val()[data.val().length-1];
    let polar_name = Object.values(polar_bear.options[polar_bear.index].name)[0];

    let penguins =
    data.val()
        .map(x=>x.options[x.index])
        .filter((x,i,arr)=>i < arr.length-1)
        .map((x,i,arr)=>{
          return Object.values(x.name).map((p,q)=>{
            return{
              id: x.id,
              name: p.match(/^.+(?= )/g)[0],
              value: (i==5) ? 2 : q+1,
              disguise: p.match(/\w+$/g)[0],
              extra_args: (i < arr.length-1) ? `` : ` ^[‡](#small)`,
            }
          })
        })
        .reduce((x,i)=>x.concat(i),[])
        .map((x,i,arr)=>{
          return arr.filter((p,q)=>arr.findIndex(s=>s.value===p.value)===q)
                    .map(u=>arr.filter(w=>w.value===u.value))
        })[0]
        .reduce((x,i)=>x.concat(i),[])
        .map(x=>{
          switch(SPECIAL_LABELS.map(p=>p[x.value-1]).findIndex(s=>s.includes(x.id)))
          {
            case 0: //Desert
              x.extra_args = `Desert [${x.name}](#small)${x.extra_args}`;
              x.name = "";
              break;
            case 1: //Sophanem
              x.extra_args = `Sophanem [${x.name.match(/^\w+(?= )/g)}](#small)${x.extra_args}`;
              x.name = "";
              break;
            case 2: //Wilderness
              x.extra_args = `Wilderness [${x.name}](#small) [](#danger)${x.extra_args}`;
              x.name = "";
              break;
            default:
              break;
          }
          return x;
        })
        .map((x,i)=>{
          if(x.extra_args.length > 0){
            //Special/Freezer
            if(x.name.length > 0){
              //Freezer
              return `> ${i+1}. | ${x.name}${x.extra_args} | [](#${EvalDisguise(x.disguise).toLowerCase()}) ${EvalDisguise(x.disguise)} | ${x.value}`
            }//Special
            else return `> ${i+1}. | ${x.extra_args} | [](#${EvalDisguise(x.disguise).toLowerCase()}) ${EvalDisguise(x.disguise)} | ${x.value}`
          }
          else return `> ${i+1}. | ${x.name} | [](#${EvalDisguise(x.disguise).toLowerCase()}) ${EvalDisguise(x.disguise)} | ${x.value}`
        })
        .concat(
          [
            `-`,
            `* __This week the Polar Bear can be found in the ${polar_name}.__`,
            `* __This week the Circus can be found ${circus_name}.__`,
            `* __‡ : Back to the Freezer penguin.__`,
            ` `,
            `#Please post locations below as you spy!`,
            `---`,
            `^Quick&nbsp;links: ^[Spawn&nbsp;locations](https://runescape.wiki/w/Penguin_Hide_and_Seek/Spawn_locations) ^| ^[Quest&nbsp;requirements](https://runescape.wiki/w/Penguin_Hide_and_Seek#Optional_quest_unlocks) ^| ^[Roam-ranges](https://www.reddit.com/r/World60Pengs/wiki/roam-ranges) ^| ^[Point&nbsp;Calculator](https://runescape.wiki/w/Calculator%3AOther/Penguin_points)`,
          ]);

    //Post Date
    let date = moment.tz(new Date(),`Europe/London`).format(`MMMM Do YYYY`);

    let result =
    [
      `#For the week of ${date}:`,
      `> \\# | Spawn | Disguise | Points`,
      `> ---:|:---|:---|---:`,
    ].concat(penguins)
     .map(x=>`${x}\n`)
     .join(``)

    $(`#reddit-copy`).attr(`data-clipboard-text`,result);

  }

  firebase.database().ref(`current-week`).on('child_added',x=>{
    Display(x)
    ParseReddit(x)
  })

  firebase.database().ref(`current-week`).on('child_changed',x=>{
    if(x.val().every(k=>!isNaN(k))){
      return;
    }
    Display(x)
    ParseReddit(x)
  })

  $(`#reddit-settings > div:nth-child(1) > div > input`).click(function(){
    firebase.database().ref(`current-week`).once(`value`,x=>
      ParseReddit({
        key: parseInt(Object.keys(x.val())[0]),
        val: function(){return Object.values(x.val())[0];}
      })
    )
  })
})
