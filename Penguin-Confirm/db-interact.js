$(document).ready(function(){

  function CurrentWeek(){
    return new Promise((resolve,reject)=>{
      firebase.database()
              .ref()
              .limitToLast(1)
              .once(`value`)
              .then(x=>{
                resolve(Object.keys(x.val())[0])
              })
              .catch(err=>{
                reject(err)
              })
    });
  }

  $(`#content-home .card a`).click(function(){

    //Get pressed anchor
    let $clicked = $(this);

    //Get card used
    let $card_target = $clicked.parents(`.card`)[0];

    //Get index of pressed anchor
    let clicked_index = $.inArray($clicked.parent()[0],$($card_target).find(`.col-6`))

    //Map this card to the database index it refers to
    let db_index = $.inArray($card_target,$("#content-home .card"));

    if(db_index > 5)
    {
      clicked_index = $.inArray($clicked.parent()[0],$($card_target).find(`.col-4`))
    }

    CurrentWeek().then(x=>{
                    let updates = {};

                    updates[`${x}/${db_index}/index`] = clicked_index;
                    updates[`${x}/${db_index}/confirm`] = true;

                    return firebase.database().ref().update(updates);
                  })
                 .catch(err=>console.log(err))

  })

  $("#content-setup .form-control").change(function(){

    //get reference to the card being changed
    let $card_setup = $(this).parents(".card")[0];

    //Get index of text slot modified
    let text_slot = $.inArray(this,$($card_setup).find(".form-control"));

    //get index for database
    let db_index = $.inArray($card_setup,$("#content-setup .card"));

    let text = $(this).val();

    //map values as there is only one option
    if(db_index === 5)
    {
      switch (text_slot) {
        case 0:
          text_slot = 0;
          break;
        case 1:
          text_slot = 2;
          break;
        case 2:
          text_slot = 3;
          break;
        case 3:
          text_slot = 5;
          break;
      }
    }

    CurrentWeek().then(x=>{
                    let query = `${x}/${db_index}/options`;
                    let update = {}
                    switch(text_slot){
                      case 0://id, first
                        update[`${query}/0/id/`] = parseInt(text);
                        break;
                      case 1://0th, first
                        update[`${query}/0/name/0/`] = text;
                        break;
                      case 2://0th, second
                        update[`${query}/0/name/1/`] = text;
                        break;
                      case 3://id, second
                        update[`${query}/1/id/`] = parseInt(text);
                        break;
                      case 4://1st, first
                        update[`${query}/1/name/0/`] = text;
                        break;
                      case 5://1st, second
                        update[`${query}/1/name/1/`] = text;
                        break;
                    }
                    return firebase.database().ref().update(update);
                  })
                 .catch(err=>console.log(err))
  });
});
