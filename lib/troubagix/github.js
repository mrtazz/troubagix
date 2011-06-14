/**
 *  module to interact with the github v3 API
 */
var events = require('events');

module.exports = GithubAPI;

function GithubAPI()
{
  events.EventEmitter.call(this);
}

// inherit EventEmitter properties
GithubAPI.super_ = events.EventEmitter;
GithubAPI.prototype = Object.create(events.EventEmitter.prototype, {
    constructor: {
        value: GithubAPI,
        enumerable: false,
        events : { issue: 'troubagix-repository-issue',
                   push: 'troubagix-repository-push',
                   comment: 'troubagix-repository-comment',
                   tag: 'troubagix-repository-tag',
                   pull: 'troubagix-repository-pull-request' }
    }
});


GithubAPI.prototype.get_issues_for_repository = function(repository)
{
  // TODO: query github API here
  this.emit(this.events.issue, {});
  return this;
};

