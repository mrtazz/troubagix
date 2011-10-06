/**
 * commands which the bot can execute
 *
 * all methods should call the callback with the
 * respons string and the callee.
 */
module.exports.dice_roll = function(callee, callback)
{
  var rand = Math.random(), ans = "";

  if (rand < 0.5) { ans = "heads"; }
  else { ans = "tails"; }
  callback(ans, callee);
  return;
}
