import * as dotenv from 'dotenv';
import path from 'path';
import { Dialect } from 'sequelize';

import constants from './constants';

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      USERNAME: string;
      PASSWORD: string;
      DATABASE: string;
      HOST: string;
      DIALECT: Dialect;
      PORT: string;
      HSECRET: string;
      OPENAI_API_KEY: string;
    }
  }
}

export default {
  db: {
    DATABASE: process.env.DATABASE ?? 'sientia',
    USERNAME: process.env.USERNAME ?? 'postgres',
    PASSWORD: process.env.PASSWORD ?? 'postgres',
    HOST: process.env.HOST ?? 'localhost',
    DIALECT: process.env.DIALECT ?? 'postgres',
    PORT: process.env.PORT ?? '5433',
  },
  HSECRET: process.env.HSECRET ?? 'someSecreateKey',
  GPT_TASK: process.env.GPT_TASK ?? 'http://localhost:8000/ask',
  GPT_QUIZ: process.env.GPT_QUIZ ?? 'http://localhost:8000/makeQuiz',
  constants,
} as const;
