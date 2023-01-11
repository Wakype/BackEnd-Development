const http = require('http');
const hello = require('./hello');
const example = require('./example');
const { moveMessagePortToContext } = require('worker_threads');
const moment = require('moment');

// const port = 8803;
const port = 8087;
const hostName = '127.0.0.1';

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  // res.setHeader('Content-Type', 'text/plain');
  res.setHeader('Content-Type', 'text/json');
  const url = req.url;

  // res.write(moment().calendar());
  // res.write('hello world');
  // res.write(hello);
  // res.write(example.bilangan(5));
  // res.write(example.smk);
  if (url === '/sekolah') {
    res.write(
      JSON.stringify({
        status: 'success',
        message: 'response success',
        data: {
          pesan: 'ini adalah route /sekolah',
          smk: example.smk,
          hari: moment().calendar(),
        },
      })
    );
  } else {
    res.write(
      JSON.stringify({
        status: 'success',
        message: 'response success',
        data: {
          pesan: 'ini bukan route /sekolah',
        },
      })
    );
  }

  // res.write(
  //   JSON.stringify({
  //     status: 'success',
  //     message: 'response success',
  //     data: {
  //       bilangan: example.bilangan(5),
  //       smk: example.smk,
  //       hari: moment().calendar(),
  //     },
  //   })
  // );
  res.end();
});
// .listen(port)

server.listen(port, hostName, () => {
  console.log(`server running on port ${port} at http://${hostName}:${port}/`);
});
