/**
 * commands which the bot can execute
 *
 * all methods should call the callback with the
 * respons string and the callee.
 */
var http = require('http')
    querystring = require('querystring'),
    GithubAPI = require('./github.js');

var github = new GithubAPI();

module.exports.all_cmds = [];
module.exports.all_descrs = [];

// wrapper to add commands
var command = function(pattern, action)
{
  module.exports.all_cmds.push([pattern, action]);
}

// wrapper to add help for the commands
var desc = function(cmd, description)
{
  module.exports.all_descrs.push([cmd, description]);
  module.exports.all_descrs.sort().reverse();
}

//help
command(/help/, function(message)
    {
      if (module.exports.all_descrs.length)
        for (var i = module.exports.all_descrs.length - 1; i >= 0; i--){
          ans = module.exports.all_descrs[i][0];
          if(module.exports.all_descrs[i][1] !== undefined)
            ans += ": "+module.exports.all_descrs[i][1];
          message.callback(ans);
        }
      else
        message.callback('OH NOES, Y U ASK 4 HELP?? NO COMMANDS THARE ):', message.from);
    }
);

// Github API commands
desc("get|fetch all issues for <user/project>",
     "fetches all issues for the given Github project");
command(/(get|fetch) all issues for/,
        function(message)
        {
          var repo = message.body.match(/all issues for (\S+)/)[1];
          github.get_all_issues(repo);
          github.once(github.events.issue,
                    function(issues)
                    {
                      for (i in issues)
                      {
                        var issue = issues[i];
                        var num = issue.number;
                        var title = issue.title;
                        var msg = repo + ": issue #" + num + "=> ";
                            msg += title;
                        message.callback(msg, message.from);
                      }
                    }
          ); // github.on
        }
);

desc("get|fetch issue <number> for <user/project>",
     "fetches a specific issue of the given Github project");
command(/(get|fetch) issue #?(\d+) of /,
        function(message)
        {
          var m = message.body.match(/issue #?(\d+) of (\S+)/);
          var repo = m[2];
          var inum = m[1];
          github.get_specific_issue(repo, inum);
          github.once(github.events.singleissue,
                    function(issue)
                    {
                       var title = issue.title;
                       var msg = repo + ": issue #" + inum + "=> ";
                           msg += title + "\n";
                           msg += issue.body + "\n";
                       message.callback(msg, message.from);
                    }
          ); // github.on
        }
);

// dice roll
desc('dice', 'roll a dice');
command(/dice/, function(message)
    {
      var rand = Math.random(), ans = "";

      if (rand < 0.5) { ans = "heads"; }
      else { ans = "tails"; }
      message.callback(ans, message.from);
    }
);

// get weather for a town
desc('weather <place>', 'get weather in <place>');
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

// BIJ
command(/respond|answer me|bij/,
        function(message)
        {
          message.callback("EXPERIENCE BIJ.", message.from);
        }
);

// get commit message
desc('commit message', 'Get your next commit message');
command(/commit message/,
        function(message)
        {
          var host = "whatthecommit.com",
              path = "/index.txt";
          http.get({ host: host, path: path },
            function(res)
            {
              var r = '';
              res.on('data', function(chunk) { r += chunk; });
              res.on('end', function() { message.callback(r, message.from); });
            }).on('error', function(e) { console.error(e); });
        }
);

// fortune
desc('fortune');
command(/fortune/,
        function(message)
        {
          var host = "www.fortunefortoday.com",
              path = "/getfortuneonly.php";
          http.get({ host: host, path: path },
            function(res)
            {
              var r = '';
              res.on('data', function(chunk) { r += chunk; });
              res.on('end', function() { message.callback(r, message.from); });
            }).on('error', function(e) { console.error(e); });
        }
);

// alemmanisch
command(/nid|eh|ischs|isch|mol|ebbis/,
        function(message)
        {
          message.callback("Blos ma doch in de Hobel.", message.from);
        }
);

// wikipedia querying
desc('search <phrase> on wikipedia');
command(/search (.+?) on wikipedia/,
        function(message)
        {
          var esc = querystring.escape
          var subj = message.body.match(/search (.+?) on wikipedia/)[1],
              host = "en.wikipedia.org",
              path = "/w/api.php?action=opensearch&format=json&search=";
              path += esc(subj);
          http.get({ host: host, path: path,
                     headers: {'User-Agent': 'troubagix/0.0.1'} },
            function(res)
            {
              var r = '';
              res.on('data', function(chunk) { r += chunk; });
              res.on('end', function()
                {
                  try
                  {
                    var res = JSON.parse(r);
                    if (res[1][0])
                    {
                      message.callback("http://en.wikipedia.org/wiki/"+esc(res[1][0]),
                                      message.from);
                    }
                    else
                    {
                      message.callback("Found nothing.", message.from);
                    }
                  }
                  catch(e){console.log("Wikipedia error: "+e);}
                });
            }).on('error', function(e) { console.error(e); });
        }
);
