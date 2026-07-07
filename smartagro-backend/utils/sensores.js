function parseMqttPayload(payload, topic) {
  if (!payload) {
    return null;
  }

  const normalizedTopic = String(topic || '').toLowerCase();

  if (typeof payload === 'object') {
    return {
      temperatura: Number(payload.temperatura ?? payload.temp ?? payload.temperature),
      umidade: Number(payload.umidade ?? payload.humidity ?? payload.umid),
      nivel_agua: Number(payload.nivel_agua ?? payload.water ?? payload.nivelAgua ?? payload.water_level),
    };
  }

  const text = String(payload).trim();
  const values = {};

  const tokenPattern = /(temperatura|temp|temperature|umidade|humidity|umid|nivel_agua|water|nivelAgua|water_level)\s*=\s*([-+]?\d+(?:\.\d+)?)/gi;
  let match;
  while ((match = tokenPattern.exec(text)) !== null) {
    const [, key, value] = match;
    values[key.toLowerCase()] = Number(value);
  }

  return {
    temperatura: values.temperatura ?? values.temp ?? values.temperature,
    umidade: values.umidade ?? values.humidity ?? values.umid,
    nivel_agua: values.nivel_agua ?? values.water ?? values.nivelagua ?? values.water_level,
  };
}

function buildSensorSnapshot(readings) {
  const safeReadings = readings || {};

  return {
    temperatura: {
      nome: 'Temperatura',
      valor: safeReadings.temperatura?.valor ?? null,
      unidade: safeReadings.temperatura?.unidade ?? '°C',
      atualizacao: safeReadings.temperatura?.atualizacao ?? null,
    },
    umidade: {
      nome: 'Umidade do Solo',
      valor: safeReadings.umidade?.valor ?? null,
      unidade: safeReadings.umidade?.unidade ?? '%',
      atualizacao: safeReadings.umidade?.atualizacao ?? null,
    },
    nivel_agua: {
      nome: 'Nível de Água',
      valor: safeReadings.nivel_agua?.valor ?? null,
      unidade: safeReadings.nivel_agua?.unidade ?? '%',
      atualizacao: safeReadings.nivel_agua?.atualizacao ?? null,
    },
  };
}

module.exports = {
  parseMqttPayload,
  buildSensorSnapshot,
};
