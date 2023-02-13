const express = require('express');
const dotenv = require('dotenv').config();
const { sequelize } = require('./src/models');

const routers = require('./src/routes/routers');
const log = require('./src/middleware/log');
const notFound = require('./src/middleware/404');
const errorHandling = require('./src/middleware/errorHandling');
const auth = require('./src/middleware/auth');
const paginationMiddleware = require('./src/middleware/pageSizeMiddleware');

const app = express();
const port = process.env.PORT || 8081;

app.use(express.json());
app.use(log);
app.use(paginationMiddleware);
// app.use(auth);
app.use(routers);
app.use(notFound);
app.use(errorHandling);
app.use(notFound);


app.listen(port, async () => {
  try {
    await sequelize.authenticate();
    console.log('🚧 ➤➤➤ Connection has been established successfully.');
    console.log(`🖥️  ➤➤➤ Server berjalan di http://localhost:${port}`);
  } catch (error) {
    console.error('🚫 ➤➤➤ Unable to connect to the database:', error);
  }
});

// npx sequelize model:create --name produk  --attributes namaProduk:string,deskripsiProduk:string,hargaProduk:int,stokProduk:int,ratingProduk:string
