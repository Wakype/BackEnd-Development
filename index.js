const express = require('express');
const bodyParser = require('body-parser');

const routers = require('./routers');
const log = require('./middleware/log');
const notFound = require('./middleware/404');
const errorHandling = require('./middleware/errorHandling');

const app = express();
const port = 8080;

app.use(log);
app.use(routers);
app.use(bodyParser.json());
app.use(errorHandling);
app.use(notFound);

// app.listen(port, () =>
//   console.log(`Server berjalan di http://localhost:${port}`)
// );

app.listen(port, function () {
  return console.log(`Server berjalan di http://localhost:${port}`);
});
