const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const knex = require('../config/db');
const router = express.Router();

router.post('/register', async (req, res) => {
  const { nome, email, senha } = req.body;
  const hash = await bcrypt.hash(senha, 10);

  try {
    await knex('usuarios').insert({ nome, email, senha: hash });
    res.status(201).json({ mensagem: 'Usuário cadastrado' });
  } catch (err) {
    res.status(400).json({ erro: 'Erro ao cadastrar' });
  }
});

router.post('/login', async (req, res) => {
  const { email, senha } = req.body;
  const user = await knex('usuarios').where({ email }).first();

  if (!user || !(await bcrypt.compare(senha, user.senha))) {
    return res.status(401).json({ erro: 'Credenciais inválidas' });
  }

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: '1d',
  });

  res.json({ token });
});

module.exports = router;
