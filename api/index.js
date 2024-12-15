const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 8080;

app.use(morgan('combined'));
app.use(cors());

app.use(express.static('public'));

app.get('*', (req, res) => {
  res.send('Companies data provider');
});

app.listen(port, () => {
  console.log(`API listening on port ${port}`);
});
