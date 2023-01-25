const ProdukModel = require('../models').produk;

async function getListProduk(req, res) {
  try {
    const produks = await ProdukModel.findAll();
    res.json({
      status: 200,
      msg: 'Data berhasil ditemukan',
      data: produks,
    });
  } catch (err) {
    res.status(403).json({
      status: '404 Not Found',
      msg: 'Ada Kesalahan',
    });
  }
}

async function getDetailProdukById(req, res) {
  let { id } = req.params;

  const barang = await ProdukModel.findByPk(id);

  if (barang === null) {
    res.status(404).json({
      status: 404,
      msg: 'Barang not found',
    });
  }

  try {
    res.json({
      status: 200,
      msg: 'Detail successfully',
      data: barang,
    });
  } catch (err) {
    res.status(403).json({
      status: '403 Not Found',
      msg: 'ada kesalahan',
    });
  }
}

async function getDetailProdukByKategori(req, res) {
  let { kategori } = req.params;

  const produk = await ProdukModel.findOne({
    where: {
      kategoriProduk: kategori,
    },
  });

  if (produk === null) {
    res.status(404).json({
      status: '404 Not Found',
      msg: 'Produk not found',
    });
  }

  try {
    res.json({
      status: '200 OK',
      msg: 'Produk ditemukan',
      data: produk,
    });
  } catch (err) {
    res.status(403).json({
      status: '403 Not Found',
      msg: 'ada kesalahan',
    });
  }
}

async function createProduk(req, res) {
  try {
    let payload = req.body
    let {namaProduk, deskripsiProduk, kategoriProduk, daerah, hargaProduk, stokProduk} = payload

    await ProdukModel.create({
      namaProduk: namaProduk,
      deskripsiProduk: deskripsiProduk,
      kategoriProduk: kategoriProduk,
      daerah: daerah,
      hargaProduk: hargaProduk,
      stokProduk: stokProduk
    })

    res.status(201).json({
      status: 'success',
      msg: 'produk created'
    })
  } catch(err) {
    res.status(403).json({
      status: 'error 403',
      msg: 'ada kesalahan'
    })
  }
}

module.exports = {
  getListProduk,
  getDetailProdukById,
  getDetailProdukByKategori,
  createProduk
};
