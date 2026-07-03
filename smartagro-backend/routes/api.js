const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const knex = require('../config/db');
const router = express.Router();

async function ensureSchema() {
  const hasUsuarios = await knex.schema.hasTable('usuarios');
  if (!hasUsuarios) {
    await knex.schema.createTable('usuarios', (table) => {
      table.increments('id').primary();
      table.string('nome').notNullable();
      table.string('email').notNullable().unique();
      table.string('senha').notNullable();
      table.timestamp('created_at').defaultTo(knex.fn.now());
    });
  } else {
    const hasSenha = await knex.schema.hasColumn('usuarios', 'senha');
    if (!hasSenha) {
      await knex.schema.table('usuarios', (table) => {
        table.string('senha');
      });
    }
  }

  const hasConfiguracoes = await knex.schema.hasTable('configuracoes');
  if (!hasConfiguracoes) {
    await knex.schema.createTable('configuracoes', (table) => {
      table.increments('id').primary();
      table.integer('usuario_id').notNullable().unique();
      table.boolean('notificacoes').defaultTo(true);
      table.boolean('modo_economia').defaultTo(false);
      table.integer('umidade_minima').defaultTo(35);
      table.integer('umidade_maxima').defaultTo(55);
    });
  }

  const hasHistorico = await knex.schema.hasTable('historico');
  if (!hasHistorico) {
    await knex.schema.createTable('historico', (table) => {
      table.increments('id').primary();
      table.integer('usuario_id').notNullable();
      table.string('data').notNullable();
      table.string('acao').notNullable();
    });
  }
}

ensureSchema().catch((err) => {
  console.error('Erro ao inicializar schema do backend:', err);
});

router.get('/health', (req, res) => {
  res.json({ ok: true, message: 'Backend online' });
});

router.post('/cadastro', async (req, res) => {
  await ensureSchema();

  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).json({ sucesso: false, mensagem: 'Preencha todos os campos.' });
  }

  try {
    const exists = await knex('usuarios').where({ email }).first();
    if (exists) {
      return res.status(409).json({ sucesso: false, mensagem: 'E-mail já cadastrado.' });
    }

    const hash = await bcrypt.hash(senha, 10);
    await knex('usuarios').insert({ nome, email, senha: hash });

    res.status(201).json({ sucesso: true, mensagem: 'Conta criada com sucesso!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ sucesso: false, mensagem: 'Erro ao cadastrar usuário.' });
  }
});

router.post('/login', async (req, res) => {
  const { email, senha } = req.body;

  try {
    const user = await knex('usuarios').where({ email }).first();
    if (!user || !(await bcrypt.compare(senha, user.senha))) {
      return res.status(401).json({ sucesso: false, mensagem: 'Credenciais inválidas.' });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'smartagro-secret', {
      expiresIn: '1d',
    });

    res.json({ sucesso: true, token, usuario: { id: user.id, nome: user.nome, email: user.email } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ sucesso: false, mensagem: 'Erro ao fazer login.' });
  }
});

router.get('/configuracoes/:id', async (req, res) => {
  try {
    const config = await knex('configuracoes').where({ usuario_id: req.params.id }).first();
    if (!config) {
      return res.json({ notificacoes: true, modo_economia: false, umidade_minima: 35, umidade_maxima: 55 });
    }

    res.json({ notificacoes: Boolean(config.notificacoes), modo_economia: Boolean(config.modo_economia), umidade_minima: config.umidade_minima, umidade_maxima: config.umidade_maxima });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao buscar configurações.' });
  }
});

router.put('/configuracoes/:id', async (req, res) => {
  try {
    await knex('configuracoes').where({ usuario_id: req.params.id }).delete();
    await knex('configuracoes').insert({
      usuario_id: req.params.id,
      notificacoes: req.body.notificacoes,
      modo_economia: req.body.modo_economia,
      umidade_minima: req.body.umidade_minima,
      umidade_maxima: req.body.umidade_maxima,
    });

    res.json({ sucesso: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao salvar configurações.' });
  }
});

router.get('/controle/:id', async (req, res) => {
  try {
    const config = await knex('configuracoes').where({ usuario_id: req.params.id }).first();
    if (!config) {
      return res.json({ umidade_minima: 35, umidade_maxima: 55 });
    }

    res.json({ umidade_minima: config.umidade_minima, umidade_maxima: config.umidade_maxima });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao buscar controle.' });
  }
});

router.put('/controle/:id', async (req, res) => {
  try {
    await knex('configuracoes').where({ usuario_id: req.params.id }).delete();
    await knex('configuracoes').insert({
      usuario_id: req.params.id,
      notificacoes: true,
      modo_economia: false,
      umidade_minima: req.body.umidade_minima,
      umidade_maxima: req.body.umidade_maxima,
    });

    res.json({ sucesso: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao salvar controle.' });
  }
});

router.get('/historico/:id', async (req, res) => {
  try {
    const registros = await knex('historico').where({ usuario_id: req.params.id }).orderBy('id', 'desc');
    res.json(registros);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao buscar histórico.' });
  }
});

router.post('/historico', async (req, res) => {
  try {
    await knex('historico').insert({
      usuario_id: req.body.usuario_id,
      data: req.body.data || new Date().toISOString().slice(0, 10),
      acao: req.body.acao,
    });
    res.json({ sucesso: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao salvar histórico.' });
  }
});

module.exports = router;
