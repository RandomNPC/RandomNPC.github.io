$(document).ready(function(){

  const roles =
  $(`#content-home .card:first-child .card-block button`).toArray()
                                                         .map(x=>$(x).text())

  const day_of_week = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
  const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];

  firebase.database()
          .ref(`players`)
          .on(`value`,data=>{
            let content =
            data.val()
                .map(x=>[
                  x.name,
                  x.roles.filter(k=>k>5)
                         .map(k=>roles[k])
                         .join(` + `),
                  x.roles.filter(k=>k<=5 && k>=0)
                         .map(k=>roles[k])
                         .join(` + `)
                ])
                .map(x=>[x[0],x[1]===""?`DPS`:x[1],x[2]===""?`DPS`:x[2]])
                .map(x=>x.map(k=>`[td][center]${k}[/center][/td]`))
                .map(x=>`[tr]\n${x.join(`\n`)}\n[/tr]`)
                .join(``)

            let date = new Date();

            $("#output-teamspeak").val(
                [`[table]`,
                 `[tr]`,
                 `[th][center]${day_of_week[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}[/center][/th]`,
                 `[td][center]Hosted by ${data.val()[0].name}[/center][/td]`,
                 `[/tr]`,
                 `[tr]`,
                 `[td][/td]`,
                 `[tr][/table]`,
                 `(Names marked with a * are people learning roles for the first time.)`,
                 `[table]`,
                 `[tr][/tr]`,
                 `[tr]`,
                 `[th]Name[/th]`,
                 `[th]Yakamaru[/th]`,
                 `[th]Beastmaster[/th]`,
                 `[/tr]`,
                 `${content}`,
                 `[/table]`,
               ].join(`\n`)
            )
          })
});
