const canonicalize = str => {
  if (!str) {
    return str;
  }
  return str
    .toLowerCase()
    .normalize()
    .trim()
    .replace(/\s+/g, "");
};

module.exports = canonicalize;
