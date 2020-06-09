const Moniker = require("moniker");
const names = Moniker.generator([Moniker.adjective, Moniker.noun], {
  maxSize: undefined,
  encoding: "utf-8",
  glue: " "
});

/**
 * Generates a random team name in the form 'AdjectiveNoun'
 */
function generateName() {
  return names
    .choose()
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");
}

module.exports = generateName;
