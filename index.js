const express = require('express');
const bodyParser = require('body-parser');
// const fs = require('fs-extra')
const multer = require('multer');
const dotenv = require('dotenv').config();
const { sequelize } = require('./src/models');

const routers = require('./src/routes/routers');
const log = require('./src/middleware/log');
const notFound = require('./src/middleware/404');
const errorHandling = require('./src/middleware/errorHandling');
const auth = require('./src/middleware/auth');

const app = express();
const port = process.env.PORT || 8081;

// app.use(bodyParser.json());
app.use(express.json());
app.use(log);
app.use(express.static('./src/storage/uploads'));
// app.use(auth);
app.use(routers);
app.use(notFound);
app.use(errorHandling);
app.use(notFound);

// app.listen(port, () =>
//   console.log(`Server berjalan di http://localhost:${port}`)
// );

app.listen(port, async () => {
  try {
    await sequelize.authenticate();
    console.log('🚧 ➤➤➤ Connection has been established successfully.');
    console.log(`🖥️  ➤➤➤ Server berjalan di http://localhost:${port}`);
  } catch (error) {
    console.error('🚫 ➤➤➤ Unable to connect to the database:', error);
  }
});
