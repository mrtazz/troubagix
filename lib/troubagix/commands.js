/**
 * commands which the bot can execute
 *
 * all methods should call the callback with the
 * respons string and the callee.
 */
var http = require('http');

module.exports.all_cmds = [];

// wrapper to add commands
var command = function(pattern, action)
{
  module.exports.all_cmds.push([pattern, action]);
}

// dice roll
command(/dice/, function(message)
    {
      var rand = Math.random(), ans = "";

      if (rand < 0.5) { ans = "heads"; }
      else { ans = "tails"; }
      message.callback(ans, message.from);
    }
);

// get weather for a town
command(/weather .+? (\S+)$/,
        function(message)
        {
          var town = message.body.match(/weather .+? (\S+)$/)[1],
              host = "www.google.com",
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
                message.callback(response, message.from);
              });

            }).on('error', function(e) {
                console.error(e);
              });
        }
);

// the laws
command(/laws|rules/,
        function(message)
        {
          var first   = "1. A robot may not injure a human being or, through inaction, ";
              first  += "allow a human being to come to harm.";
          var second  = "2. A robot must obey the orders given to it by human beings, ";
              second += "except where such orders would conflict with the First Law.";
          var third   = "3. A robot must protect its own existence as long as such ";
              third  += "protection does not conflict with the First or Second Laws.";

          message.callback(first,  message.from);
          message.callback(second, message.from);
          message.callback(third,  message.from);
        }
);
