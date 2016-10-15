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
}

function jsonCallback(json){
  console.log(json);
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
