console.log("Loading script.js...");

var query;

var acTimeout;
var acInput;
function lookup() {
  console.log("lookup()...");
  var q = $('#symbol').val();
  if(q == acInput) {
    console.log("... ignoring matching q");
  }
  if(acTimeout) {
    console.log("Clearing timeout");
    clearTimeout(acTimeout);
  }
  if(q.length > 0) {
    acTimeout = setTimeout(fetchLookup,300,q);
    acInput = q;
  }
}

function fetchLookup(q) {
  console.log("fetchLookup("+q+")");
  var url = 'http://dev.markitondemand.com/MODApis/Api/v2/Lookup/jsonp?input=';
  url += encodeURIComponent(q);

  console.log("Fetching " +url+ " ...");
  $.ajax({
    url: url,
    dataType: 'jsonp',
    jsonp: 'jsoncallback',
    jsonpCallback: 'showSuggestions',
    // error: function(jqXHR, testStatus, errorThrown) {
    //   console.log("ERROR:" +errorThrown);
    // },
  });
}

function showSuggestions(sugs) {
  //TODO: Assert that sugs is an array, silently fail.
  console.log("showSuggestions()...");
  // console.log(sugs);
  var $list = $('#suggestions');
  $list.empty();
  sugs.forEach(function(sug, index, array) {
    console.log(index,sug);
    var row = $('<a>')
      .addClass('list-group-item')
      .addClass('list-group-item-action')
      .html('(<strong>'+sug.Symbol+'</strong>) '+sug.Name)
      .click(function(e) {
        $('#symbol').val(sug.Symbol);
        startSearch();
        $list.hide();
      });
    $list.append(row);
  });
  $list.show();
}

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

function fetchQuote() {
  $('#error-alert').hide();

  var url = 'http://dev.markitondemand.com/MODApis/Api/v2/Quote/jsonp?symbol=';
  url += encodeURIComponent(query);

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

function processData(data) {
  console.log("processData...");
  console.log(data);
  if(data.Status && data.Status == 'SUCCESS') {
    $('#ticker').text(data.Symbol);
    $('#asset-name').text(data.Name);
    $('#last-price').text(data.LastPrice);
    $('#change').html(numeral(data.Change).format('0.000'));
    $('#change-percent').html(numeral(data.ChangePercent/100).format('0.00%'));

    $('#open-price').text(data.Open);
    $('#high-price').text(data.High);
    $('#low-price').text(data.Low);
    $('#ytd-change').text(data.ChangeYTD);
    $('#ytd-percent').text(numeral(data.ChangePercentYTD/100).format('(0.00%)'));

    $('#volume').text(numeral(data.Volume).format('0.00a'));
    $('#market-cap').text(numeral(data.MarketCap).format('0.00a'));

    $('#info').show();

    //TODO: Start a refresh loop.
  }
  else {
    console.log("Error:",data.Message);
    //There was an error.
    $('#info').hide();
    $('#error-alert').text(data.Message);
    $('#error-alert').show();
  }
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
      lookup();
    }
  });
});
