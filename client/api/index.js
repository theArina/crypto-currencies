const axios = require('axios');

const instance = axios.create();

export async function getAssets() {
  const response = await instance.get('/api/assets');
  return response.data.result; // TODO: handle errors
}

export async function getTickers(pairs) {
  const query = `?pairs=${pairs?.join(',')}`;
  const response = await instance.get(`/api/tickers${query}`);
  return response.data.result;
}
