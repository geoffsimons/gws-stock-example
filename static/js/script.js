console.log("Loading script.js...");

var query;

function startSearch() {
  var q = $('#symbol').val();

  $('#symbol').blur();

  if(!q || q.length == 0) {
    console.log("Ignoring invalid search query.");
    return;
  }

  console.log("Start search. Query: " +q);
  query = q;
  fetchQuote();
}

function processData(data) {
  console.log("processData...");
  console.log(data);
  //TODO: Check for errors.

  $('#ticker').text(data.Symbol);
  $('#asset-name').text(data.Name);
  $('#last-price').text(data.LastPrice);
  $('#change').html(numeral(data.Change).format('+0.000'));
  $('#change-percent').html(numeral(data.ChangePercent/100).format('0.00%'));

  $('#open-price').text(data.Open);
  $('#high-price').text(data.High);
  $('#low-price').text(data.Low);
  $('#ytd-change').text(data.ChangeYTD);
  $('#ytd-percent').text(numeral(data.ChangePercentYTD/100).format('(0.00%)'));

  $('#volume').text(numeral(data.Volume).format('0.000a'));
  $('#market-cap').text(numeral(data.MarketCap).format('0.000a'));

  //TODO: Start a refresh loop.

}

function fetchQuote() {
  var url = 'http://dev.markitondemand.com/MODApis/Api/v2/Quote/jsonp?symbol=';
  url += query;

  console.log("Fetching " +url+ " ...");
  $.ajax({
    url: url,
    dataType: 'jsonp',
    jsonp: 'jsoncallback',
    jsonpCallback: 'processData',
    // error: function(jqXHR, testStatus, errorThrown) {
    //   console.log("ERROR:" +errorThrown);
    // },
  });
}

$(document).ready(function () {
  console.log("document ready...");
  $('#search').click(function(e) {
    startSearch();
  });

  $('#search').mouseup(function(e) {
    $(this).blur();
  });

  $('#symbol').keyup(function(e) {
    if(e.which == 13) {
      startSearch();
    }
    else {
      //TODO: convert the query to upper-case.
    }
  });
});
