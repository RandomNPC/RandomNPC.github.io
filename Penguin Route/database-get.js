var API_KEY = "AIzaSyDkC-bMPs5LSQF1Wqukx1EheLmGQgO0elk";
var SPREADSHEET_ID = "1daB2uGhejLaeIbNgYvdAOruu9Tr0bu2uOonPK8cC_Ag";
var QUERY = "ranges=Data!A:A&ranges=Data!B:B&ranges=Offset!A:A&ranges=Offset!B:B";
var SITE = "https://sheets.googleapis.com/v4/spreadsheets/" + SPREADSHEET_ID + "/values:batchGet?" + QUERY +"&key=" +API_KEY;

$(document).ready(function(){

  $.map($("#output tr td:first-child"),(element)=>{$(element).hide();});

  $.ajax({
      type: 'GET',
      url: SITE,
      contentType: 'text/plain',
      xhrFields: {
        withCredentials: false
      },
      success: function(data){
        var selection = [""];
        $.map(data.valueRanges[0].values,(key)=>{selection.push(key);});
        $.map(data.valueRanges[1].values,(key)=>{selection.push(key);});

        selection = $.map(selection,(select)=>{return select.toString().replace(/.\(.+/g,"");});

        $.map($("#input li > table td:nth-child(2) >"),(value)=>{
          $(value).autocomplete({
            source: selection,
            close: function(event,ui){
              UpdateRoute();
              UpdateLink();
            },
            change: function(event,ui){
              UpdateRoute();
              UpdateLink();
            }
          });
        })
      }
  });

});
