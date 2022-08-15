const express = require('express');
const router = express.Router();
const { errorHandler } = require('../middleware');
const Controller = require('../controller');

router.get('/assets', async (request, response, next) => {
  try {
    const res = await Controller.getAssetPairs();
    response.send(res);
  } catch (e) {
    next();
  }
});

router.use(errorHandler);

module.exports = router;
