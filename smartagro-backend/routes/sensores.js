const express = require('express');
const knex = require('../config/db');
const router = express.Router();

// Receber dados do sensor
router.post('/leitura', async (req, res) => {
  const { sensor_id, valor, unidade } = req.body;

  try {
    await knex('leituras').insert({ sensor_id, valor, unidade });
    res.json({ mensagem: 'Leitura salva com sucesso' });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao salvar leitura' });
  }
});

// Consultar últimas leituras
router.get('/ultimas/:sensor_id', async (req, res) => {
  const { sensor_id } = req.params;

  const leituras = await knex('leituras')
    .where({ sensor_id })
    .orderBy('data_hora', 'desc')
    .limit(10);

  res.json(leituras);
});

module.exports = router;
