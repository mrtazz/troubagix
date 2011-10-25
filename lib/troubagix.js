/**
 * main troubagix lib file to expose API
 */

var IRCModule = require('./troubagix/irc.js'),
    cmds      = require('./troubagix/commands.js');

var github = new GithubAPI();
var ircmodule = new IRCModule();


var express = require('express');

var app = express.createServer(express.logger());

app.get('/', function(request, response) {
  response.send('Hello World!');
});

var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log("Listening on " + port);
});


ircmodule.listen();

ircmodule.on(ircmodule.events.channelmessage, function(from, message, chan)
{
  var match = false;
  // build the message object with default settings that will be passed to the function
  var m = {};
  m.from = from;
  m.channel = chan;
  // go through all available commands
  for (var i in cmds.all_cmds)
  {
    var pattern = cmds.all_cmds[i][0];
    var fun = cmds.all_cmds[i][1];
    // check the regex
    if (message.match(pattern))
    {
      // sir, we have a match
      match = true;
      m.body = message;
      m.callback = ircmodule.say;
      fun(m);
    }
  }
  if (!match)
  {
    ircmodule.say("42!", m);
    ircmodule.say("No seriously, I'm sorry I have no clue what you mean.", m);
  }
});

ircmodule.on(ircmodule.events.privatemessage, function(from, message)
{
  console.log('private %s: %s', from, message);
});


setTimeout(ircmodule.say, 10000, "I'm alive!");
