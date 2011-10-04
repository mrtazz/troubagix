/**
 * main troubagix lib file to expose API
 */

var GithubAPI = require('./troubagix/github.js'),
    IRCModule = require('./troubagix/irc.js');

var github = new GithubAPI();
var ircmodule = new IRCModule();

var issues = github.get_all_issues('mrtazz/troubagix');

issues.on(github.events.issue, function(issues)
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
});

ircmodule.on(ircmodule.events.privatemessage, function(from, message)
{
  console.log('private %s: %s', from, message);
});
