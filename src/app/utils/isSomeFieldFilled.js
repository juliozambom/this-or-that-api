function isSomeFieldFilled(fields) {
  return fields.map((item) => item !== "" && item && true).includes(true);
}

module.exports = isSomeFieldFilled;
