const ArtikelModel = require('../models').artikel;

async function getArtikel(req, res) {
  try {
    const artikel = await ArtikelModel.findAll({
      where: {
        userID: req.id,
      },
    });

    res.json({
      status: 200,
      msg: 'Artikel was successfully',
      data: artikel,
    });
  } catch (err) {
    res.status(403).json({
      status: '404 Not Found',
      msg: 'Ada Kesalahan',
    });
  }
}

async function createArtikel(req, res) {
  try {
    let payload = req.body;
    let { title, year, description } = payload;

    await ArtikelModel.create({
      title: title,
      year: year,
      description: description,
      userID: req.id,
    });

    res.status(201).json({
      status: '201',
      msg: 'Artikel created successfully',
    });
  } catch (err) {
    res.status(403).json({
      status: 'error',
      msg: 'error creating',
    });
  }
}

async function bulkCreateArtikel(req, res) {
  try {
    let { payload } = req.body;
    payload.map((item, index) => {
      item.userID = req.id;
    });

    await ArtikelModel.bulkCreate(payload);

    res.status(201).json({
      status: '201',
      msg: 'Multi Artikel created successfully',
    });
  } catch (err) {
    res.status(403).json({
      status: 'error',
      msg: 'error creating',
    });
  }
}
async function bulkCreateArtikel2(req, res) {
  try {
    let { payload } = req.body;
    let success = 0;
    let fail = 0;
    let jumlah = payload.length;

    await Promise.all(
      payload.map(async (item, index) => {
        try {
          await ArtikelModel.create({
            title: item.title,
            year: item.year,
            description: item.description,
            userID: req.id,
          });

          success = success + 1;
        } catch (err) {
          fail = fail + 1;
        }
      })
    );

    res.status(201).json({
      status: '201',
      msg: `sukses menambahkan ${success} artikel dari total ${jumlah} artikel dan gagal ${fail} artikel`,
    });
  } catch (err) {
    res.status(403).json({
      status: 'error',
      msg: 'error creating',
    });
  }
}

async function getArtikelByUser(req, res) {
  let { userID } = req.params;

  const artikel = await ArtikelModel.findAll({
    where: {
      userID: userID,
    },
  });

  if (artikel === null) {
    res.status(404).json({
      status: 404,
      msg: 'Artikel not found',
    });
  }

  try {
    res.json({
      status: 200,
      msg: 'Detail successfully',
      data: artikel,
    });
  } catch (err) {
    res.status(403).json({
      status: '403 Not Found',
      msg: 'ada kesalahan',
    });
  }
}

async function updateArtikel(req, res) {
  let { id } = req.params;
  const artikel = await ArtikelModel.findByPk(id);
  const payload = req.body;
  let { title, year, description } = payload;
  try {
    if (artikel === null) {
      return res.status(404).json({
        status: 404,
        msg: 'artikel not found',
      });
    }
    if (req.id === artikel.userID) {
      await ArtikelModel.update(
        { title, year, description },
        {
          where: {
            id: id,
          },
        }
      );
      res.json({
        status: '200 OK',
        msg: 'artikel updated',
      });
    } else {
      res.json({
        status: 'err',
        msg: 'unauthorized',
      });
    }
  } catch (err) {
    res.status(403).json({
      status: 'failed',
      msg: 'ada kesalahan update',
    });
  }
}
async function deleteArtikel(req, res) {
  let { id } = req.params;
  const artikel = await ArtikelModel.findByPk(id);

  try {
    if (artikel === null) {
      return res.status(404).json({
        status: 404,
        msg: 'artikel not found',
      });
    }
    if (req.id === artikel.userID) {
      await ArtikelModel.destroy({
        where: {
          id: id,
        },
      });
      res.json({
        status: '200 OK',
        msg: 'artikel deleted',
      });
    } else {
      res.json({
        status: 'err',
        msg: 'unauthorized',
      });
    }
  } catch (err) {
    res.status(403).json({
      status: 'failed',
      msg: 'ada kesalahan delete',
    });
  }
}
async function multiDeleteArtikel(req, res) {
  try {
    const { payload } = req.body;
    let jumlah = payload.length;
    let success = 0;
    let fail = 0;
    await Promise.all(
      payload.map(async (items, index) => {
        try {
          const artikel = await ArtikelModel.findOne({
            where: { id: items.id },
          });
          if (artikel.userID !== req.id) {
            return res.json({
              status: 'Fail',
              msg: 'unauthorized',
            });
          }
          await ArtikelModel.destroy({
            where: { id: items.id },
          });
          success = success + 1;
        } catch (error) {
          console.log(error);
          fail = fail + 1;
        }
      })
    );
    res.status(201).json({
      status: 'Success',
      msg: `sukses menghapus ${success} artikel dari ${jumlah} artikel dengan ${fail} gagal`,
    });
  } catch (error) {
    console.log(error);
    res.status(403).json({
      status: 'Fail',
      msg: 'Something went wrong',
      err: error,
    });
  }
}

module.exports = {
  createArtikel,
  getArtikel,
  getArtikelByUser,
  updateArtikel,
  bulkCreateArtikel,
  deleteArtikel,
  bulkCreateArtikel2,
  multiDeleteArtikel,
};
