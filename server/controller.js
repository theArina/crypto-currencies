const https = require('node:https');

const baseURI = 'https://api.kraken.com/0/public';

async function get(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => resolve(data))
    }).on('error', reject);
  });
}

async function getAssetPairs() {
  const response = await get(`${baseURI}/AssetPairs?info=margin`);
  return JSON.parse(response);
}

async function getTickers(pair) {
  const response = await get(`${baseURI}/Ticker?pair=${pair}`);
  return JSON.parse(response);
}

module.exports = { getAssetPairs, getTickers };
