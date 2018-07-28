$(document).ready(function(){
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyCf9OcO4bzKT27Gx-5XxcnLnqAIls6bLTU",
    authDomain: "raid-worksheet-7a372.firebaseapp.com",
    databaseURL: "https://raid-worksheet-7a372.firebaseio.com",
    projectId: "raid-worksheet-7a372",
    storageBucket: "raid-worksheet-7a372.appspot.com",
    messagingSenderId: "21800807525"
  };
  firebase.initializeApp(config);

  const arr =
  $(`#content-home .card`).map((x,i)=>[[`.text.padding`,`.form-control`,`.list`,`.card-block button`].map(k=>$(i).find(k))])

  firebase.database()
          .ref(`players`)
          .once(`value`)
          .then(data=>{
            data.val().forEach((x,i)=>{
              $(arr[i][0]).text(x.name);
              //$(arr[i][1]).val(x.name);
              x.roles.forEach(k=>{
                if(k>=0){
                  let $ref = $($(arr[i][3])[k]);

                  //Copy this role to the role list for said person
                  $ref.clone().appendTo($(arr[i][2]))

                  //Hide other copies of this role
                  arr.map((p,q)=>q[3][k])
                     .toArray()
                     .filter((s,t)=>t!=i)
                     .forEach(u=>$(u).hide())
                }
              })
            })
          })

  firebase.database()
          .ref(`players`)
          .on(`child_changed`,(data)=>{

            let target = arr[data.key];
            let content = data.val();

            $(target[0]).text(content.name);
            //$(target[1]).val(content.name);
            $(target[2]).find(`button:not(.btn-warning)`).remove();

            content.roles.forEach(k=>{
              let $ref = $($(target[3])[k]);
              $ref.clone().appendTo($(target[2]))
            })

            //show all buttons
            $(arr.map((x,i)=>i[3].toArray())).show();

            firebase.database()
                    .ref(`players`)
                    .once(`value`)
                    .then(arg=>{
                      //What roles have been assigned
                      let active_roles =
                      arg.val()
                         .map(x=>x.roles);

                      //Collect each role into an array
                      let selected_roles =
                      active_roles.reduce((x,i)=>x.concat(i))
                                  .filter(x=>x>=0)

                      active_roles.map(x=>selected_roles.filter(k=>!x.includes(k)))
                                  .forEach((x,i)=>x.forEach(k=>$(arr[i][3][k]).hide()))

                    })
          })

  $($(arr.map((x,i)=>i[3].toArray()))).click(function(){
    //Which button was pressed?
    let $target = $(this)

    //Which card index was this clicked?
    let target_index = $(`#content-home .card`).toArray().indexOf($target.parents(`.card`)[0]);

    //Which index was pressed?
    let role_index = $(arr[target_index][3]).toArray().indexOf($target[0])

    //Get the person's current role indicies and update them
    firebase.database()
            .ref(`players/${target_index}/roles`)
            .once(`value`)
            .then(x=>{
              if(x.val().includes(role_index))
              {
                let roles = x.val().filter(k=>k!=role_index)
                return (roles.length > 0) ? roles : [-1];
              }
              else {
                return x.val().concat(role_index).filter(k=>k>=0)
              }
            })
            .then(x=>firebase.database().ref(`players/${target_index}/roles`).set(x))
            .catch(err=>console.log(err))
  })

  $($(arr.map((x,i)=>i[1].toArray()))).change(function(){
    //Which textbox was changed?
    let $target = $(this)

    //Which card index was changed?
    let target_index = $(`#content-home .card`).toArray().indexOf($target.parents(`.card`)[0]);

    //Update Database
    firebase.database()
            .ref(`players/${target_index}`)
            .update({name:$target.val()})
            .catch(err=>console.log(err))
  })

  $(`#button-reset`).click(function(){
    firebase.database()
            .ref(`players`)
            .set(Array(10).fill(null).map((x,i)=>{return {name:`Player ${i+1}`,roles:[-1]}}));
  })
});
