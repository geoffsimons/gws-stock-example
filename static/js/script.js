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

}

function injectScript(url) {
  var head = document.head;
  var script = document.createElement("script");

  script.setAttribute("src", url);
  head.appendChild(script);
  //TODO: Should there be a delal before removing the script?
  head.removeChild(script);
}

function fetchQuote() {
  // fetchQuote_proxy();
  fetchQuote_xd();
}

function fetchQuote_proxy() {
  var url = '/stocks/' +query;
  console.log("Fetching " +url+ " ...");
  $.getJSON(url, function(data) {
    console.log("Success!");
    console.log(data);
  });
}

function fetchQuote_xd() {
  var url = 'http://dev.markitondemand.com/MODApis/Api/v2/Quote/jsonp?symbol=';
  url += query;
  // url += "&jsoncallback=processData"

  // $.getJSON(url+"?callback=?",function(json){
  //   console.log(json);
  // });

  console.log("Fetching " +url+ " ...");
  $.ajax({
    // crossDomain: true,
    url: url,
    dataType: 'jsonp',
    jsonp: 'jsoncallback',
    jsonpCallback: 'processData',
    // error: function(jqXHR, testStatus, errorThrown) {
    //   console.log("ERROR:" +errorThrown);
    // },
    sucess: function(data, textStatus, jqXHR) {
      console.log("Success!");
    }
  });

/*
  $.getJSON(url, function(data) {
    console.log(data);
    if(data.Status && data.Status == "SUCCESS") {
      var last = data.LastPrice;
      console.log("Success - LastPrice: " + last);
    }
    else {
      //{"Message":"No symbol matches found for GOOGhsdofhhwdf. Try another symbol such as MSFT or AAPL, or use the Lookup API."}
    }

    //TODO: setTimeout(fetchQuote, 1000);
  });
*/
}


$(document).ready(function () {
  console.log("document ready...");
  // $('#search-btn').click(function(e) {
  // $('button').click(function(e) {
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
