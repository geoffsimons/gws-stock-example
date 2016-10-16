# mnp

Simple demo that connects with the Markit on Demand API to
lookup symbols and fetch stock quotes.

Current dependencies:
Numeral.js
Font Awesome
Bootstrap
jQuery

The only dependencies you'll need to install are Numeral.js and Font Awesome.
For now, you'll need to manually install them.
http://numeraljs.com/
http://fontawesome.io/get-started/

To install our node dependencies:
npm install

For running the app, we can do a live preview with continuous integration:
npm run dev

We can also run as a web server on port 80 with our light express wrapper.
sudo node http.js

Markit on Demand shares their API with the condition that it is only
used for back office apps, and not published on the web. If you intend
to publish this app, please contact them to ask what you need to do.

http://dev.markitondemand.com/MODApis/
https://github.com/markitondemand/DataApis
