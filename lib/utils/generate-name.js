const Moniker = require("moniker");

/**
 * Generates a random team name in the form 'AdjectiveNoun'
 */
const generateName = () => {
  const names = Moniker.generator([Moniker.adjective, Moniker.noun], {
    maxSize: undefined,
    encoding: "utf-8",
    glue: " "
  });
  const name = names
    .choose()
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");
  return name;
};

module.exports = generateName;
