/**
 * main troubagix lib file to expose API
 */

var GithubAPI = require('./troubagix/github.js'),
    IRCModule = require('./troubagix/irc.js'),
    cmds      = require('./troubagix/commands.js');

var github = new GithubAPI();
var ircmodule = new IRCModule();

github.poll_repo_for_issues('mrtazz/troubagix', 5000);

github.on(github.events.issue, function(issues)
    {
      console.log(issues);
      for (i in issues)
      {
        var issue = issues[i];
        console.log(issue);
      }
    });


ircmodule.listen();

ircmodule.on(ircmodule.events.channelmessage, function(from, message)
{
  console.log('channel %s: %s', from, message);
  if (message.match(/dice/)) {cmds.dice_roll(from, ircmodule.say);}
  if (message.match(/weather .+? (\S+)$/))
  {
    var town = message.match(/weather .+? (\S+)$/)[1];
    cmds.weather_me(town, from, ircmodule.say);
  }
});

ircmodule.on(ircmodule.events.privatemessage, function(from, message)
{
  console.log('private %s: %s', from, message);
});


setTimeout(ircmodule.say, 10000, "I'm alive!");
