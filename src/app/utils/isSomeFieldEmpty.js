function isSomeFieldEmpty(fields) {
  return fields.includes(undefined || "");
}

module.exports = isSomeFieldEmpty;
