'use strict';
import corsPackage from 'cors';
import config from '../config/index.js';

const corsOptions = {
  origin: config.server.frontendUrl,
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200,
};

const cors = corsPackage(corsOptions);

export default cors;
