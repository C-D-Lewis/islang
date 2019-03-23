const ImportText = {
  fetch: `const request = require('request');
const { promisify } = require('util');
const requestAsync = promisify(request.get);

async function fetch (url) {
  const res = await requestAsync(url);
  return res.body;
}`,
};

module.exports = {
  ImportText,
};
