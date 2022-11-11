function isSomeFieldEmpty(fields) {
  const isUndefined = fields.includes(undefined);
  const isEmptyString = fields.includes("");

  if (isUndefined || isEmptyString) {
    return true;
  }
}

module.exports = isSomeFieldEmpty;
