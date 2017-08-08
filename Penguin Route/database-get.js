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

        $.map($("#input td:nth-child(2) input"),(selector)=>{
          $(selector).autocomplete({
            source: selection,
            change: function( event, ui ) {
              var index = $.inArray(this,$("#input td:nth-child(2) input"));

              var content = $(this).val();

              var $node = $("#output tr:eq("+index*2+") td:eq(1)");
              $node.text(content);

              var $via = $("#output tr:eq("+index*2+") td:eq(2)");
              var via_text = $via.val();

              $("#output tr:eq("+index*2+") td:eq(0)").show();//.toggleClass("circle");
              if(index > 0){
                $("#output tr:eq("+(index*2-1)+") td:eq(0)").show();
              }
              
              UpdateLink();
            },
          });
        });
      }
  });

});
