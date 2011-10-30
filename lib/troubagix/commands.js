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

// easy random function
var random = function(items)
{
  return items[Math.floor(Math.random() * items.length)];
}

//help
command(/help/i, function(message)
    {
      if (module.exports.all_descrs.length)
        for (var i = module.exports.all_descrs.length - 1; i >= 0; i--){
          ans = module.exports.all_descrs[i][0];
          if(module.exports.all_descrs[i][1] !== undefined)
            ans += ": "+module.exports.all_descrs[i][1];
          message.callback(ans, message);
        }
      else
        message.callback('OH NOES, Y U ASK 4 HELP?? NO COMMANDS THARE ):', message.from);
    }
);

// Github API commands
desc("get|fetch all issues for <user/project>",
     "fetches all issues for the given Github project");
command(/(get|fetch) all issues for (\S+)/i,
        function(message)
        {
          var repo = message.match[2];
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
                        message.callback(msg, message);
                      }
                    }
          ); // github.on
        }
);

desc("get|fetch issue <number> for <user/project>",
     "fetches a specific issue of the given Github project");
command(/(get|fetch) issue #?(\d+) of (\S+)/i,
        function(message)
        {
          var repo = message.match[3];
          var inum = message.match[2];
          github.get_specific_issue(repo, inum);
          github.once(github.events.singleissue,
                    function(issue)
                    {
                       var title = issue.title;
                       var msg = repo + ": issue #" + inum + "=> ";
                           msg += title + "\n";
                           msg += issue.body + "\n";
                       message.callback(msg, message);
                    }
          ); // github.on
        }
);

// dice roll
desc('coin', 'throw a coin');
command(/coin/i, function(message)
    {
      var rand = Math.random(), ans = "";

      if (rand < 0.5) { ans = "heads"; }
      else { ans = "tails"; }
      message.callback(ans, message);
    }
);

// get weather for a town
desc('weather <place>', 'get weather in <place>');
command(/weather .+? (\S+)$/i,
        function(message)
        {
          var town = message.match[1],
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
                message.callback(response, message);
              });

            }).on('error', function(e) {
                console.error(e);
              });
        }
);

// the laws
desc('laws|rules', 'Display the laws I live by');
command(/laws|rules/i,
        function(message)
        {
          var first   = "1. A robot may not injure a human being or, through inaction, ";
              first  += "allow a human being to come to harm.";
          var second  = "2. A robot must obey the orders given to it by human beings, ";
              second += "except where such orders would conflict with the First Law.";
          var third   = "3. A robot must protect its own existence as long as such ";
              third  += "protection does not conflict with the First or Second Laws.";

          message.callback(first,  message);
          message.callback(second, message);
          message.callback(third,  message);
        }
);

// BIJ
desc('respond|answer me|bij', 'EXPERIENCE BIJ');
command(/respond|answer me|bij/i,
        function(message)
        {
          message.callback("EXPERIENCE BIJ.", message);
        }
);

// get commit message
desc('commit message', 'Get your next commit message');
command(/commit message/i,
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
desc('fortune', 'tell a fortune');
command(/fortune/i,
        function(message)
        {
          var host = "www.fortunefortoday.com",
              path = "/getfortuneonly.php";
          http.get({ host: host, path: path },
            function(res)
            {
              var r = '';
              res.on('data', function(chunk) { r += chunk; });
              res.on('end', function() { message.callback(r, message); });
            }).on('error', function(e) { console.error(e); });
        }
);

// alemmanisch
desc('nid|eh|ischs|isch|mol|ebbis','Alemmanic ftw!');
command(/nid|eh|ischs|isch|mol|ebbis/i,
        function(message)
        {
          message.callback("Blos ma doch in de Hobel.", message);
        }
);

// wikipedia querying
desc('search <phrase> on wikipedia');
command(/search (.+?) on wikipedia/i,
        function(message)
        {
          var esc = querystring.escape
          var subj = message.match[1],
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
                                      message);
                    }
                    else
                    {
                      message.callback("Found nothing.", message);
                    }
                  }
                  catch(e){console.log("Wikipedia error: "+e);}
                });
            }).on('error', function(e) { console.error(e); });
        }
);

// like a boss
desc('like a boss');
command(/like a boss/i,
        function(message)
        {
          images = [
            "http://s3.amazonaws.com/kym-assets/photos/images/original/000/114/151/14185212UtNF3Va6.gif?1302832919",
            "http://s3.amazonaws.com/kym-assets/photos/images/newsfeed/000/110/885/boss.jpg",
            "http://verydemotivational.files.wordpress.com/2011/06/demotivational-posters-like-a-boss.jpg",
            "http://assets.head-fi.org/b/b3/b3ba6b88_funny-facebook-fails-like-a-boss3.jpg",
            "http://img.anongallery.org/img/6/0/like-a-boss.jpg",
            ];
          message.callback(random(images), message);

        }
);
// like a boss
desc('like an adult');
command(/like an adult/i,
        function(message)
        {
          images = [
            "http://1.bp.blogspot.com/_D_Z-D2tzi14/TBpOnhVqyAI/AAAAAAAADFU/8tfM4E_Z4pU/s400/responsibility12(alternate).png",
            "http://2.bp.blogspot.com/_D_Z-D2tzi14/TBpOglLvLgI/AAAAAAAADFM/I7_IUXh6v1I/s400/responsibility10.png",
            "http://4.bp.blogspot.com/_D_Z-D2tzi14/TBpOY-GY8TI/AAAAAAAADFE/eboe6ItMldg/s400/responsibility11.png",
            "http://2.bp.blogspot.com/_D_Z-D2tzi14/TBpOOgiDnVI/AAAAAAAADE8/wLkmIIv-xiY/s400/responsibility13(alternate).png",
            "http://3.bp.blogspot.com/_D_Z-D2tzi14/TBpa3lAAFQI/AAAAAAAADFs/8IVZ-jzQsLU/s400/responsibility14.png",
            "http://3.bp.blogspot.com/_D_Z-D2tzi14/TBpoOlpMa_I/AAAAAAAADGU/CfZVMM9MqsU/s400/responsibility102.png",
            "http://4.bp.blogspot.com/_D_Z-D2tzi14/TBpoVLLDgCI/AAAAAAAADGc/iqux8px_V-s/s400/responsibility12(alternate)2.png",
            "http://2.bp.blogspot.com/_D_Z-D2tzi14/TBpqGvZ7jVI/AAAAAAAADGk/hDTNttRLLks/s400/responsibility8.png"
            ];
          message.callback(random(images), message);

        }
);
