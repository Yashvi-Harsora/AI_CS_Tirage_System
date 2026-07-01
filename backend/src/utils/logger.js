'use strict';
import config from '../config/index.js';

const LEVELS = { error: 0, warn: 1, info: 2 };
const currentLevel = LEVELS[config.log.level] ?? 2;

function format(level, message, meta = {}) {
  const ts = new Date().toISOString();
  const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
  return `[${ts}] [${level.toUpperCase()}] ${message}${metaStr}`;
}

const logger = {
  error: (msg, meta) => {
    if (currentLevel >= LEVELS.error) console.error(format('error', msg, meta));
  },
  warn: (msg, meta) => {
    if (currentLevel >= LEVELS.warn) console.warn(format('warn', msg, meta));
  },
  info: (msg, meta) => {
    if (currentLevel >= LEVELS.info) console.log(format('info', msg, meta));
  },
};

export default logger;
