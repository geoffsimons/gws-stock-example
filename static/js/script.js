console.log("Loading script.js...");

var query;

var acTimeout;
var acInput;
function lookup() {
  console.log("lookup()...");
  var q = $('#symbol').val();
  if(q == acInput) {
    console.log("... ignoring matching q");
    return;
  }
  cancelLookup(); //Will check if acTimeout is truthy
  if(q.length > 0) {
    acTimeout = setTimeout(fetchLookup,300,q);
    acInput = q;
  }
}

function cancelLookup() {
  if(acTimeout) {
    console.log("Clearing timeout");
    clearTimeout(acTimeout);
  }
  acTimeout = null;
  acInput   = null;
}

function fetchLookup(q) {
  console.log("fetchLookup("+q+")");
  var url = 'http://dev.markitondemand.com/MODApis/Api/v2/Lookup/jsonp?input=';
  url += encodeURIComponent(q);

  fetch(url, 'showSuggestions');
}

function showSuggestions(sugs) {
  //TODO: Assert that sugs is an array, silently fail.
  console.log("showSuggestions()... acInput:",acInput);
  if(!acInput) {
    console.log("Suggestions were canceled. acInput not valid.");
    //Do we need to do any dom element cleanup?
    return;
  }
  //NOTE: The API does not return our input, so there is no
  //      way to guarantee that sugs match, but we do cancel
  //      fetches in order to save hits on any rate limit,
  //      which in turn means there will be less sugs coming
  //      through this function.

  // console.log(sugs);
  var $list = $('#suggestions');
  $list.empty();
  sugs.forEach(function(sug, index, array) {
    // console.log(index,sug);
    var row = $('<a>')
      .addClass('list-group-item')
      .addClass('list-group-item-action')
      .addClass('sug-row')
      .html('(<strong class="text-primary">'+sug.Symbol+'</strong>) '+sug.Name)
      .click(function(e) {
        $('#symbol').val(sug.Symbol);
        startSearch();
        $list.hide();
      });
    $list.append(row);
  });
  $list.show();
  $('#info').hide();
  $('#error-alert').hide();
}

function startSearch() {
  cancelLookup();
  $('#suggestions').hide();

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

  fetch(url, 'processData');
}

function processData(data) {
  console.log("processData...");
  console.log(data);
  if(data.Status && data.Status == 'SUCCESS') {
    $('#ticker').text(data.Symbol);
    $('#asset-name').text(data.Name);
    $('#last-price').text(data.LastPrice);
    $('#change').html(numeral(data.Change).format('0.000'));
    $('#change').attr('class',(data.Change < 0 ? 'text-danger' : 'text-success'));
    $('#change-percent').html(numeral(data.ChangePercent/100).format('0.00%'));
    $('#change-percent').attr('class',(data.Change < 0 ? 'text-danger' : 'text-success'));

    $('#open-price').text(data.Open);
    $('#high-price').text(data.High);
    $('#low-price').text(data.Low);
    $('#ytd-change').text(data.ChangeYTD);
    $('#ytd-percent').text(numeral(data.ChangePercentYTD/100).format('(0.00%)'));

    $('#volume').text(numeral(data.Volume).format('0.00a'));
    $('#market-cap').text(numeral(data.MarketCap).format('0.00a'));

    $('#info').show();

    //TODO: Start a refresh loop. BUT, it should back off or stop
    //      when the market is not open. We can find out what market
    //      an equity belongs to with slight variations to lookup().
    //NOTE: According to the following issue tracked by markitondemand,
    //      the data is no longer "realtime".
    //  https://github.com/markitondemand/DataApis/issues/38
    //      Because of this, we can come back to implement auto-refresh
    //      when the API is fixed.
  }
  else {
    console.log("Error:",data.Message || data.Status);
    //There was an error.
    showError(data.Message || data.Status);
  }
}

function fetch(url, cbName) {
  console.log("Fetching " +url);
  console.log("callback:",cbName);
  $.ajax({
    url: url,
    dataType: 'jsonp',
    jsonp: 'jsoncallback',
    jsonpCallback: cbName,
    error: handleAjaxError
  });
}

function handleAjaxError(jqXHR, textStatus, errorThrown) {
  console.log("AjaxError:" +errorThrown);
  // For now, I'm going to let Ajax errors fail silently.
  //  There could be any number of reasons that the Ajax
  //  call might fail, and they typically have nothing
  //  to do with any logical error.
  // showError(errorThrown);
}

function showError(str) {
  //For now, we will just show the error and hide info and sugs.
  $('#suggestions').hide();
  $('#info').hide();
  $('#error-alert').text(str);
  $('#error-alert').show();
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
    //TODO: else if e.which is a UP or DOWN arrow
    //      We should move the highlight.
    //      Also, if a row is highlighted, use that
    //      for the search instead of the input value.
    else {
      //TODO: convert the query to upper-case.
      lookup();
    }
  });
});
