/**
 * main troubagix lib file to expose API
 */

var GithubAPI = require('./troubagix/github.js'),
    IRCModule = require('./troubagix/irc.js');

var github = new GithubAPI();

var issues = github.get_all_issues_for_repository('mrtazz/simplenote.vim');

issues.on(github.events.issue, function(issues)
    {
      console.log(issues);
      for (i in issues)
      {
        var issue = issues[i];
        console.log(issue);
      }
    });
