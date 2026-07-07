const express = require('express');
const knex = require('../config/db');
const { parseMqttPayload, buildSensorSnapshot } = require('../utils/sensores');
const router = express.Router();

let mqttClient = null;
let latestSnapshot = {
  temperatura: { nome: 'Temperatura', valor: null, unidade: '°C', atualizacao: null },
  umidade: { nome: 'Umidade do Solo', valor: null, unidade: '%', atualizacao: null },
  nivel_agua: { nome: 'Nível de Água', valor: null, unidade: '%', atualizacao: null },
};

let mqttModule;
try {
  mqttModule = require('mqtt');
} catch (error) {
  mqttModule = null;
}

async function ensureSchema() {
  const hasLeituras = await knex.schema.hasTable('leituras');
  if (!hasLeituras) {
    await knex.schema.createTable('leituras', (table) => {
      table.increments('id').primary();
      table.string('sensor_id').notNullable();
      table.float('valor').notNullable();
      table.string('unidade').defaultTo('');
      table.string('topic').nullable();
      table.timestamp('data_hora').defaultTo(knex.fn.now());
    });
  }
}

async function readLatestSnapshotFromDb() {
  await ensureSchema();

  const definitions = [
    { key: 'temperatura', nome: 'Temperatura', unidade: '°C' },
    { key: 'umidade', nome: 'Umidade do Solo', unidade: '%' },
    { key: 'nivel_agua', nome: 'Nível de Água', unidade: '%' },
  ];

  const snapshot = {};
  for (const definition of definitions) {
    const registro = await knex('leituras')
      .where({ sensor_id: definition.key })
      .orderBy('data_hora', 'desc')
      .first();

    if (registro) {
      snapshot[definition.key] = {
        nome: definition.nome,
        valor: Number(registro.valor),
        unidade: registro.unidade || definition.unidade,
        atualizacao: registro.data_hora,
      };
    }
  }

  return snapshot;
}

async function persistSensorPayload(payload, topic) {
  await ensureSchema();

  const parsed = parseMqttPayload(payload, topic);
  if (!parsed || typeof parsed !== 'object') {
    return buildSensorSnapshot(latestSnapshot);
  }

  const now = new Date().toISOString();
  const definitions = [
    { key: 'temperatura', nome: 'Temperatura', unidade: '°C' },
    { key: 'umidade', nome: 'Umidade do Solo', unidade: '%' },
    { key: 'nivel_agua', nome: 'Nível de Água', unidade: '%' },
  ];

  for (const definition of definitions) {
    const rawValue = parsed[definition.key];
    const value = Number(rawValue);
    if (Number.isFinite(value)) {
      await knex('leituras').insert({
        sensor_id: definition.key,
        valor: value,
        unidade: definition.unidade,
        topic: topic || null,
        data_hora: now,
      });

      latestSnapshot[definition.key] = {
        nome: definition.nome,
        valor: value,
        unidade: definition.unidade,
        atualizacao: now,
      };
    }
  }

  return buildSensorSnapshot(latestSnapshot);
}

function connectToMqtt() {
  if (!mqttModule || !process.env.MQTT_BROKER) {
    return;
  }

  const options = {
    clientId: `smartagro-${Date.now()}`,
    username: process.env.MQTT_USERNAME,
    password: process.env.MQTT_PASSWORD,
  };

  mqttClient = mqttModule.connect(process.env.MQTT_BROKER, options);

  mqttClient.on('connect', () => {
    const topics = (process.env.MQTT_TOPICS || 'smartagro/sensores,smartagro/esp32')
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);

    topics.forEach((topic) => mqttClient.subscribe(topic));
    console.log('Conectado ao broker MQTT:', topics);
  });

  mqttClient.on('message', async (topic, message) => {
    try {
      await persistSensorPayload(message.toString(), topic);
    } catch (error) {
      console.error('Erro ao processar mensagem MQTT:', error);
    }
  });

  mqttClient.on('error', (error) => {
    console.error('Erro na conexão MQTT:', error);
  });
}

connectToMqtt();

router.post('/leitura', async (req, res) => {
  try {
    const body = req.body && typeof req.body === 'object' ? req.body : {};
    const snapshot = await persistSensorPayload(body, body.topic || req.query?.topic || null);
    res.setHeader('Content-Type', 'application/json');
    res.json({ sucesso: true, mensagem: 'Leitura salva com sucesso', dados: snapshot });
  } catch (err) {
    console.error(err);
    res.status(500).setHeader('Content-Type', 'application/json').json({ sucesso: false, erro: 'Erro ao salvar leitura' });
  }
});

router.get('/atual', async (req, res) => {
  try {
    const fromDb = await readLatestSnapshotFromDb();
    const snapshot = Object.keys(fromDb).length > 0 ? fromDb : latestSnapshot;
    const responseBody = buildSensorSnapshot(snapshot);
    res.setHeader('Content-Type', 'application/json');
    res.json(responseBody);
  } catch (error) {
    console.error(error);
    res.status(500).setHeader('Content-Type', 'application/json').json({ erro: 'Erro ao buscar estado atual dos sensores.' });
  }
});

router.get('/ultimas/:sensor_id', async (req, res) => {
  const { sensor_id } = req.params;

  try {
    await ensureSchema();
    const leituras = await knex('leituras')
      .where({ sensor_id })
      .orderBy('data_hora', 'desc')
      .limit(10);

    res.setHeader('Content-Type', 'application/json');
    res.json(leituras);
  } catch (error) {
    console.error(error);
    res.status(500).setHeader('Content-Type', 'application/json').json({ erro: 'Erro ao buscar leituras.' });
  }
});

module.exports = router;
