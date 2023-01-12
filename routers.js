const express = require('express');
const routers = express.Router();

// get
routers.get('/', (req, res) => {
  res.send('Hello world');
});
routers.get('/user', (req, res) => {
  res.send({
    status: 200,
    message: 'Success',
    data: {
      nama: 'Hilmi',
    },
  });
});
routers.get('/siswa/:nama', (req, res) => {
  console.log('params =>', req.params);
  console.log('query =>', req.query);

  res.send({
    status: 200,
    message: 'Siswa ditemukan',
    data: {
      nama: `${req.params.nama}`,
      kelas: `${req.query.kelas}`,
      angkatan: `${req.query.angkatan}`,
    },
  });
});

//post
routers.post('/user', (req, res) => {
  const { nama, kelas } = req.body;
  res.send({
    status: 200,
    message: 'Success',
    data: {
      nama: nama,
      kelas: kelas,
    },
  });
});

module.exports = routers;
