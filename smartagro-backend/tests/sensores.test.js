const test = require('node:test');
const assert = require('node:assert/strict');

const { parseMqttPayload, buildSensorSnapshot } = require('../utils/sensores');

test('parseMqttPayload parses JSON payload with sensor values', () => {
  const payload = JSON.stringify({ temperatura: 27.4, umidade: 62, nivel_agua: 81 });

  const result = parseMqttPayload(payload, 'smartagro/sensores');

  assert.deepEqual(result, {
    temperatura: 27.4,
    umidade: 62,
    nivel_agua: 81,
  });
});

test('parseMqttPayload parses plain text payload from ESP32', () => {
  const result = parseMqttPayload('temp=24.1 humidity=58 water=73', 'smartagro/esp32');

  assert.deepEqual(result, {
    temperatura: 24.1,
    umidade: 58,
    nivel_agua: 73,
  });
});

test('buildSensorSnapshot returns a frontend-friendly payload', () => {
  const snapshot = buildSensorSnapshot({
    temperatura: { valor: 27.4, unidade: '°C', atualizacao: '2026-07-07T12:00:00.000Z' },
    umidade: { valor: 62, unidade: '%', atualizacao: '2026-07-07T12:00:00.000Z' },
    nivel_agua: { valor: 81, unidade: '%', atualizacao: '2026-07-07T12:00:00.000Z' },
  });

  assert.equal(snapshot.temperatura.nome, 'Temperatura');
  assert.equal(snapshot.umidade.nome, 'Umidade do Solo');
  assert.equal(snapshot.nivel_agua.nome, 'Nível de Água');
});
