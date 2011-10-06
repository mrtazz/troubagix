/*
  irc.js - Troubagix 'Poems from github to IRC'

  Copyright (c) 2011 Steffen Jaeckel, Daniel Schauenberg

  Permission is hereby granted, free of charge, to any person obtaining
  a copy of this software and associated documentation files (the
  "Software"), to deal in the Software without restriction, including
  without limitation the rights to use, copy, modify, merge, publish,
  distribute, sublicense, and/or sell copies of the Software, and to
  permit persons to whom the Software is furnished to do so, subject to
  the following conditions:

  The above copyright notice and this permission notice shall be
  included in all copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
  EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
  MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
  NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
  LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
  OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
  WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

var events = require('events');
var irc = require('irc');

var ircnet = 'irc.freenode.net';
var botname = 'troubagix';
var nickpass = '';
var channel = '#troubagix';
var bot = new irc.Client(ircnet, botname, {
    port: 6697,
    secure: true,
    channels: [ channel ],
});
bot.on('error', function(err) {console.log(err);})
bot.say('NickServ', ' identify '+nickpass);

module.exports = IRCModule;

function IRCModule()
{
  events.EventEmitter.call(this);
}

// inherit EventEmitter properties
IRCModule.super_ = events.EventEmitter;
IRCModule.prototype = Object.create(events.EventEmitter.prototype, {
    constructor: {
        value: IRCModule,
        enumerable: false
    }
});

IRCModule.prototype.events = {channelmessage: 'channel-message',
                              privatemessage: 'private-message' };

IRCModule.prototype.listen = function() {
  var self = this;

  bot.addListener('message', function (from, to, message) {
    // channel message
    if ( to.match(/^[#&]/) ) {
        // highlight in channel
        if ( message.match(new RegExp(botname + ':')) ) {
            self.emit(self.events.channelmessage, from, message);
        }

    }
    // private message
    else {
        self.emit(self.events.privatemessage, from, message);
    }
  });
};

IRCModule.prototype.say = function(message, to, chan) {
  var c = chan || channel;
  var t = (to === undefined) ? "" : (to + ": ") ;
  bot.say(c, t+message);
};
