/**
 * commands which the bot can execute
 *
 * all methods should return a string with the response
 */
module.exports.dice_roll = function()
{
  var rand = Math.random(), ans = "";

  if (rand < 0.5) { ans = "heads"; }
  else { ans = "tails"; }
  return ans;
}
