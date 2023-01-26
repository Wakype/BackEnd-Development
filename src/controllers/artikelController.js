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

module.exports = {
  createArtikel,
  getArtikel,
  getArtikelByUser,
  updateArtikel,
  deleteArtikel,
};
