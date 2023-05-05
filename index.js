const dotenv = require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const http = require('http');
const cors = require('cors');


const { sequelize } = require('./src/models');
const { Server } = require('socket.io');

const routers = require('./src/routes/routers');
const log = require('./src/middleware/log');
const notFound = require('./src/middleware/404');
const errorHandling = require('./src/middleware/errorHandling');
const paginationMiddleware = require('./src/middleware/pageSizeMiddleware');

const app = express();
const port = process.env.PORT || 8081;

app.use(express.json());
app.use(log);
app.use(cors())
app.use(express.static('./src/storage/uploads'));
app.use(paginationMiddleware);
app.use(routers);
app.use(notFound);
app.use(errorHandling);

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  console.log('connected with socked id =>', socket.id);

  // code here
  socket.on('join_room', (data) => {
    socket.join(data.roomCode);
    console.log('kode room: ', data);
  });
  socket.on('send_message', (data) => {
    console.log('send_message data', data)
    socket.to(data.room).emit("received_message", data)
  })
  socket.on('broadcast', (data) => {
    console.log('pesan broadcast =>', data)
    socket.broadcast.emit('broadcast_received', data)
  })
  socket.on('disconnect', () => {
    console.log('user disconnected', socket.id);
  });
});

// app.listen(port, () =>
//   console.log(`Server berjalan di http://localhost:${port}`)
// );

server.listen(port, async () => {
  try {
    // await sequelize.authenticate();
    console.log('🚧 ➤➤➤ Connection has been established successfully.');
    console.log(`🖥️  ➤➤➤ Server berjalan di http://localhost:${port}`);
  } catch (error) {
    console.error('🚫 ➤➤➤ Unable to connect to the database:', error);
  }
});

// npx sequelize model:create --name produk  --attributes namaProduk:string,deskripsiProduk:string,hargaProduk:int,stokProduk:int,ratingProduk:string
