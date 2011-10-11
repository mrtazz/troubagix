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
                               singleissue: 'repository-issue-one',
                               push: 'repository-push',
                               comment: 'repository-comment',
                               tag: 'repository-tag',
                               pull: 'repository-pull-request' };

// functions

// HTTPS get a specific URL and fire ev with response body
GithubAPI.prototype.github_get = function(url, ev, that)
{
  var self = that || this;
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
GithubAPI.prototype.get_issues_events = function(repo, that)
{
  var url = '/repos/'+repo+'/issues/events',
      ev = this.events.issue;
  return this.github_get(url, ev, that);
};

// get all issues for repo
GithubAPI.prototype.get_all_issues = function(repo, that)
{
  var url = '/repos/'+repo+'/issues',
      ev = this.events.issue;
  return this.github_get(url, ev, that);
};

// get all issues for repo
GithubAPI.prototype.get_specific_issue = function(repo, id, that)
{
  var url = '/repos/'+repo+'/issues/'+id,
      ev = this.events.singleissue;
  return this.github_get(url, ev, that);
};

GithubAPI.prototype.poll_repo_for_issues = function(repo, delay)
{
  var url = '/repos/'+repo+'/issues',
      ev = this.events.issue;
  setInterval(this.github_get, delay, url, ev, this);
};
