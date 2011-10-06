/**
 * commands which the bot can execute
 *
 * all methods should call the callback with the
 * respons string and the callee.
 */
var http = require('http');

module.exports.dice_roll = function(callee, callback)
{
  var rand = Math.random(), ans = "";

  if (rand < 0.5) { ans = "heads"; }
  else { ans = "tails"; }
  callback(ans, callee);
  return;
}

module.exports.weather_me = function(town, callee, callback)
{
  var host = "www.google.com",
      path = "/ig/api?weather="+town;
  http.get({ host: host, path: path },
    function(res)
    {
      var r = '';

      res.on('data', function(chunk) {
        r += chunk;
      });

      res.on('end', function() {
        var response = "I'm sorry, I didn't understand the city.";
        var error = r.match(/<problem_cause data=\"\"\/>/);
        if (!error)
        {
          var t = "", h = "", c = "";
          var tmp = r.match(/<temp_c data=\"(\d+)\"/);
          var hum = r.match(/<humidity data=\"Humidity: (\d+)%\"/);
          var twn = r.match(/<city data=\"(.+?)\"\/>/);
          if (tmp) {t = tmp[1];}
          if (hum) {h = hum[1];}
          if (twn) {c = twn[1];}
          response = "It's "+t+" degrees Celsius with "+h+"% humidity in "+c;
        }
        callback(response, callee);
      });

    }).on('error', function(e) {
        console.error(e);
      });
}

module.exports.the_laws = function(callee, callback)
{
  var first   = "1. A robot may not injure a human being or, through inaction, ";
      first  += "allow a human being to come to harm.";
  var second  = "2. A robot must obey the orders given to it by human beings, ";
      second += "except where such orders would conflict with the First Law.";
  var third   = "3. A robot must protect its own existence as long as such ";
      third  += "protection does not conflict with the First or Second Laws.";

  callback(first, callee);
  callback(second, callee);
  callback(third, callee);
}
