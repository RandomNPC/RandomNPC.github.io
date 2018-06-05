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

  DB_REF.ref().limitToLast(1).on('child_added',x=>Display(x))

  DB_REF.ref().on('child_changed',x=>{

    if(x.val().every(k=>!isNaN(k))){
      return;
    }
    Display(x)
  })
})
