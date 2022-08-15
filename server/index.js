const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 8080;
const APP_BUILD_DIR = path.join(__dirname, '..', 'build');

app.use(express.json());

app.use('/', express.static(APP_BUILD_DIR));

app.use('/api', require('./routes/tickers'));
app.use('/api', require('./routes/assets'));

app.get('/*', (req, res) => {
  res.sendFile(path.join(APP_BUILD_DIR, 'index.html'));
});

app.listen(port);
console.log('Server started at http://localhost:' + port);
