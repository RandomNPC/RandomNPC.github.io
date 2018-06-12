$(document).ready(function(){

  Object.defineProperty(Array.prototype,`transpose`,{
    value: function(){
      let arr = this;
      return arr.reduce((prev, next) => next.map((item, i) =>(prev[i] || []).concat(next[i])), [])
    }
  })

  Object.defineProperty(Array.prototype,`chunk`,{
    value: function(size){
      let arr = this;
      return Array(Math.ceil(arr.length / size)).fill().map((_, index) => index * size).map(begin => arr.slice(begin, begin + size))
    }
  })

  const labels =
  [
    "One Point Penguins",
    "Two Point Penguins",
    "Freezer Penguin"
  ]

  new ClipboardJS(`#copy-imgur`);

  new Promise((resolve,reject)=>{
    $.ajax({
        type: 'GET',
        url: 'https://us-central1-runescape-penguins.cloudfunctions.net/getpredictions',
        contentType: 'application/json',
        xhrFields: {
          withCredentials: false
        },
        success: function(data){
          resolve(data);
        },
        error: function(error){
          reject(error);
        }
    });
  })
  .then(data=>{
      let raw =
      data.filter((x,i)=>i<6)
          .map(x=>x.map(k=>k.name.map(p=>[k.id,p])))
          .map(x=>x.transpose())
          .map(x=>x.map(k=>k.chunk(2)))
          .map(x=>x.map(k=>k.chunk(2)))

      raw[0].map((x,i)=>raw.map((k,v)=>raw[v][i]))
            .map((x,i)=>{
              if(i==0){
                return x.filter((k,v)=>v<5)
              }
              else {
                return x;
              }
            })
            .map(x=>x.reduce((k,v)=>k.concat(v),[]))
            .reduce((k,v)=>k.concat(v),[])
            .chunk(5)
            .map((x,i)=>[[labels[i]]].concat(x))
            .forEach((x,i)=>{
              $(`#data`).append(`<table></table>`);

              x.forEach((k,v)=>{
                if(k.length > 1){
                  $(`#data table:nth-child(${i+1})`).append(
                    `<tr>
                      <td>
                        ${v}
                      </td>
                      <td>
                        <div>${k[0][0]}</div>
                        <div>${k[0][1]}</div>
                      </td>
                      <td>
                        <div>${k[1][0]}</div>
                        <div>${k[1][1]}</div>
                      </td>
                    </tr>`
                  )
                }
                else {
                  $(`#data table:nth-child(${i+1})`).append(
                    `<tr>
                      <td colspan="3" class="label">
                        ${k[0].toUpperCase()}
                      </td>
                    </tr>`
                  )
                }
              })
            })

      html2canvas(document.getElementById("data"),{
                    allowTaint:true,
                    useCORS: true,
                  })
                  .then(canvas=>localStorage.setItem("image-predict",canvas.toDataURL('image/jpeg', 0.9).split(',')[1]))
                  .catch(err=>console.log(err));

      $(`#data table > tr:not(:first-child) > td:not(:first-child)`).click(function(){
        //Which element was clicked?
        let $clicked = $(this);

        //Get the parent of clicked element in row
        let $row_strand = $clicked.parents(`tr`).find(`td:not(:first-child)`)

        //Which one of the two options in row were selected?
        let row_index = $.inArray($clicked[0],$row_strand);

        //Get all the columns
        let $col_strand = $clicked.parents(`#data table`).find('tr:not(:first-child)')

        //Which column was selected? 0-4
        let col_index = $.inArray($row_strand.parent()[0],$col_strand);

        //Which table was selected?
        let $clicked_table = $clicked.parents(`#data table`);

        //Get all the tables
        let $tables = $(`#data table`)

        //Which Table was selected?
        let table_index = $.inArray($clicked_table[0],$tables)


        switch(table_index)
        {
          case 0:
          case 1:
             $.map($(`#data table:not(:last-child)`),x=>$(x).find(`tr:not(:first-child):eq(${col_index})`))
              .forEach(x=>{
                $(x).find(`td:not(:first-child)`).removeClass(`selected`);
                $(x).find(`td:not(:first-child):eq(${row_index})`).addClass(`selected`)
              })
            break;
          case 2:
            $(`#data table:last-child > tr:not(:first-child) > td:not(:first-child)`).removeClass(`selected`)
            $(`#data table:last-child > tr:not(:first-child) > td:not(:first-child):eq(${row_index})`).addClass(`selected`)
            break;
          default:
            break;
        }

        html2canvas(document.getElementById("data"),{
                      allowTaint:true,
                      useCORS: true,
                    })
                    .then(canvas=>localStorage.setItem("image-predict",canvas.toDataURL('image/jpeg', 0.9).split(',')[1]))
                    .catch(err=>console.log(err));

      })

      $(`#menu #make-imgur`).click(function(){
        $.ajax({
         url: 'https://api.imgur.com/3/image',
         type: 'POST',
         headers: {
           Authorization: 'Client-ID ' + '2a084be43ea3a8b',
           Accept: 'application/json'
         },
         data: {
           image: localStorage.getItem("image-predict"),
         },
         success: function(result) {
           $("#link-imgur").val(`https://imgur.com/${result.data.id}`);
           $(`#copy-imgur`).attr(`data-clipboard-text`,`https://imgur.com/${result.data.id}`);
         }
        });
      })
  })
  .catch(error=>$(`body`).append(`<div>${error.responseText}</div>`))

})
