/**
 * main troubagix lib file to expose API
 */

var GithubAPI = require('./troubagix/github.js'),
    IRCModule = require('./troubagix/irc.js'),
    cmds      = require('./troubagix/commands.js');

var github = new GithubAPI();
var ircmodule = new IRCModule();

ircmodule.listen();

ircmodule.on(ircmodule.events.channelmessage, function(from, message)
{
  // go through all available commands
  for (var i in cmds.all_cmds)
  {
    var pattern = cmds.all_cmds[i][0];
    var fun = cmds.all_cmds[i][1];
    // check the regex
    if (message.match(pattern))
    {
      // build the message object and pass it to the function
      var m = {};
      m.from = from;
      m.body = message;
      m.callback = ircmodule.say;
      fun(m);
    }
  }
});

ircmodule.on(ircmodule.events.privatemessage, function(from, message)
{
  console.log('private %s: %s', from, message);
});


setTimeout(ircmodule.say, 10000, "I'm alive!");
