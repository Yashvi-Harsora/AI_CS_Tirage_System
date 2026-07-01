'use strict';
import { GoogleGenerativeAI } from '@google/generative-ai';
import config from './index.js';

const genAI = new GoogleGenerativeAI(config.gemini.apiKey);

export const geminiModel = genAI.getGenerativeModel({
  model: config.gemini.model,
});

export default genAI;
