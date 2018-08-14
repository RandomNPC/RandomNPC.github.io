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

  const DB_REF = firebase.database();

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
                  p.name.forEach((s,t)=>{
                    $($setup_ref[v][q][1][t]).val(s)
                  })
               }))


        let $ref = $.map($(`#content-home .card`),x=>$(x).find(`.col-6`))
                    .map(x=>$.map($(x),k=>$(k).find(`h6`)))

        //One/Two Pointer pairs
        x.val().map(k=>k.options)
               .filter((k,v)=>v<5)
               .map(k=>k.map(p=>p.name))
               .forEach((k,v)=>k.forEach((p,q)=>p.forEach((s,t)=>$($ref[v][q][t]).text(s))))

        //Freezer
        x.val().map(k=>k.options)
               .filter((k,v)=>v==5)
               .map(k=>k.map(p=>p.name))
               .map(k=>k.map(p=>p.filter((s,t)=>t>0)))
               .reduce((k,v)=>k.concat(v),[])
               .reduce((k,v)=>k.concat(v),[])
               .forEach((k,v)=>$($ref[5][v]).text(k))

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
    //Circus
    let circus_name = CIRCUS[data.key%12];

    //Polar Bear
    let polar_bear = data.val()[data.val().length-1];
    let polar_name = polar_bear.options[polar_bear.index].name[0];

    //Penguins
    let penguins =
    data.val()
        .filter((x,i)=>i<6)
        .map((x,i)=>x.options[x.index])
        .map(x=>x.name.map(k=>[x.id,k]))
        .transpose()
        .map(x=>x.chunk(2))
        .reverse()
        .map((x,i)=>x.filter((k,v,arr)=>v<arr.length-i))
        .reverse()
        .reduce((x,i)=>x.concat(i),[])
        .chunk(5)
        .map((x,i,arr)=>x.map(k=>{
          let data = {
            id: k[0],
            name: k[1].match(/.+\w(?= )/g)[0],
            value: Math.min(i+1,2),
            disguise: k[1].match(/\w+$/g)[0],
            extra_args: ``,
          }

          //Freezer Label
          if(i === arr.length-1){
            data.extra_args = ` ^[‡](#small)`;
          }

          //Special Labels for Wilderness, Desert, and Sophanem
          switch(SPECIAL_LABELS.map(p=>p[data.value-1]).findIndex(s=>s.includes(k[0])))
          {
            case 0: //Desert
              data.extra_args = `Desert [${data.name}](#small)${data.extra_args}`;
              break;
            case 1: //Sophanem
              data.extra_args = `Sophanem [${data.name.match(/^\w+(?= )/g)}](#small)${data.extra_args}`;
              break;
            case 2: //Wilderness
              data.extra_args = `Wilderness [${data.name}](#small) [](#danger)${data.extra_args}`;
              break;
            default:
              break;
          }

          return data;
        }))
        .reduce((x,i)=>x.concat(i),[])
        .map((x,i)=>{
          if(x.extra_args.length > ` ^[‡](#small)`.length){
            return `> ${i+1}. | ${x.extra_args} | [](#${EvalDisguise(x.disguise).toLowerCase()}) ${EvalDisguise(x.disguise)} | ${x.value}`
          }
          else return `> ${i+1}. | ${x.name}${x.extra_args} | [](#${EvalDisguise(x.disguise).toLowerCase()}) ${EvalDisguise(x.disguise)} | ${x.value}`
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
            `^Quick&nbsp;links: ^[Spawn&nbsp;locations](http://runescape.wikia.com/wiki/Penguin_Hide_and_Seek/Spawn_locations) ^| ^[Quest&nbsp;requirements](http://runescape.wikia.com/wiki/Penguin_Hide_and_Seek#Optional_quest_unlocks) ^| ^[Roam-ranges](https://www.reddit.com/r/World60Pengs/wiki/roam-ranges) ^| ^[Point&nbsp;Calculator](http://runescape.wikia.com/wiki/Calculator%3AOther/Penguin_points)`,
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

  DB_REF.ref().limitToLast(1).on('child_added',x=>{
    Display(x)
    ParseReddit(x)
  })

  DB_REF.ref().on('child_changed',x=>{

    if(x.val().every(k=>!isNaN(k))){
      return;
    }
    Display(x)
    ParseReddit(x)
  })

  $(`#reddit-settings > div:nth-child(1) > div > input`).click(function(){
    DB_REF.ref().limitToLast(1).once(`value`,x=>
      ParseReddit({
        key: parseInt(Object.keys(x.val())[0]),
        val: function(){return Object.values(x.val())[0];}
      })
    )
  })
})
