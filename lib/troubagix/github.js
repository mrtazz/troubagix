/**
 *  module to interact with the github v3 API
 */
var events = require('events');
var https = require('https');

module.exports = GithubAPI;

// setup
function GithubAPI()
{
  events.EventEmitter.call(this);
}

// inherit EventEmitter properties
GithubAPI.super_ = events.EventEmitter;
GithubAPI.prototype = Object.create(events.EventEmitter.prototype, {
    constructor: {
        value: GithubAPI,
        enumerable: false
    }
});

// attributes
GithubAPI.prototype.apihost = 'api.github.com';
GithubAPI.prototype.events = { issue: 'repository-issue',
                               push: 'repository-push',
                               comment: 'repository-comment',
                               tag: 'repository-tag',
                               pull: 'repository-pull-request' };

// functions

// HTTPS get a specific URL and fire ev with response body
GithubAPI.prototype.github_get = function(url, ev)
{
  var self = this;
  // query github API here
  https.get({ host: self.apihost, path: url },
    function(res)
    {
      var result = '';

      res.on('data', function(chunk) {
        result += chunk;
      });

      res.on('end', function() {
        self.emit(ev, JSON.parse(result));
      });

    }).on('error', function(e) {
        console.error(e);
      });
  return self;

}

// get all issue events for repo
GithubAPI.prototype.get_issues_events = function(repo)
{
  var url = '/repos/'+repo+'/issues/events',
      ev = this.events.issue;
  return this.github_get(url, ev);
};

// get all issues for repo
GithubAPI.prototype.get_all_issues = function(repo)
{
  var url = '/repos/'+repo+'/issues',
      ev = this.events.issue;
  return this.github_get(url, ev);
};

// get all issues for repo
GithubAPI.prototype.get_specific_issue = function(repo, id)
{
  var url = '/repos/'+repo+'/issues/'+id,
      ev = this.events.issue;
  return this.github_get(url, ev);
};

