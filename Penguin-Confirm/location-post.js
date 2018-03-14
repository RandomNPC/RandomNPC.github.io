function Output(){
    console.log('trigger')
    firebase.database().ref('penguins').once('value')
    .then(snap=>{
      let output = ``;
      snap.val().forEach((entry,index)=>{
        let name = entry.entries[entry.index].descriptor;
        let location = entry.location;
        let entry_index = (index >= 10) ? (index === 10) ? "F" : "Polar Bear" : (index%5)+1;
        switch(index)
        {
          case 0:
            output += `1-Point Penguins\n`;
            break;
          case 5:
            output += `\n2-Point Penguins\n`;
            break;
          default:
            break;
        }

        if(index > 10)
        {
          output += `\n${entry_index} - ${name}`;
        }
        else{
          output += `${entry_index}) ${name} - ${location}\n`;
        }
      });

      $(`#output-location`).val(output);
      $(`#copy-location`).attr(`data-clipboard-text`,output);
    }).catch(error=>{
      console.log(error)
    });
};

$(document).ready(function(){
  new ClipboardJS(`#copy-location`);

});
