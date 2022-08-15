const express = require('express');
const router = express.Router();
const { errorHandler } = require('../middleware');
const Controller = require('../controller');

router.get('/tickers', async ({ query }, response, next) => {
  try {
    const res = await Controller.getTickers(query?.pairs);
    response.send(res);
  } catch (e) {
    next();
  }
});

router.use(errorHandler);

module.exports = router;
