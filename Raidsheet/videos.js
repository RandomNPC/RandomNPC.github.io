$(document).ready(function(){

  const roles =
  $(`#content-home .card:first-child .card-block button`).toArray()
                                                         .map(x=>$(x).text())

  firebase.database()
          .ref(`players`)
          .on(`value`,arg=>{
            let content =
            arg.val()
               .map(x=>x.roles.map(k=>[k,x.name]))
               .reduce((x,i)=>x.concat(i),[])
               .sort((a,b)=>(a[0] < b[0]) ? -1 : 1)
               .map((x,i,arr)=>[arr.filter(k=>k[0]<=5),arr.filter(k=>k[0]>5)])[0]
               .map(x=>x.concat([[`\nDPS`,arg.val().map(k=>k.name).filter(p=>!x.map(k=>k[1]).includes(p)).join(`,`)]]))
               .map(x=>x.map(k=>[isNaN(k[0])?k[0]:roles[k[0]],k[1]]))
               .map(x=>x.map(k=>k.join(`: `)))
               .map((x,i)=>[[`Beastmaster Roles\n`],[`\nYakamaru Roles\n`]][i].concat(x))
               .map(x=>x.join(`\n`))
               .join(`\n`)

            $("#output-video").text(content)
          })
})
