import express from 'express';
// import { PORT } from "./config/index";
import cookieParser from 'cookie-parser';
import { DB } from './db/models/index';
import { AuthRoutes } from './router/auth';
import { TaskRoutes } from './router/task';
import { QuizRoutes } from './router/quiz';
import errorMiddleware from './middleware/error';
import { UserAttributes } from './db/models/user';
import cors from 'cors';
import { HomeRoutes } from './router/home';
import { Server } from 'http';

const authRoutes = new AuthRoutes();
const taskRoutes = new TaskRoutes();
const quizRoutes = new QuizRoutes();
const homeRoutes = new HomeRoutes();

declare global {
  namespace Express {
    export interface Request {
      user: UserAttributes;
    }
  }
}

export class App {
  public app: express.Application;
  public env: string;
  public port: number;
  public server: Server | undefined;

  constructor(routes: any) {
    this.app = express();
    this.env = 'DEVELOPMENT';
    this.port = 3000;
    this.startMiddleware();
    this.startRoutes(routes);

    this.registerErrorMiddleware();
  }

  private startMiddleware() {
    this.app.use(express.json());
    this.app.use(cookieParser());
    this.app.use(cors({ origin: 'http://localhost:3001', credentials: true }));
  }

  public async connectToDB() {
    try {
      await DB.sequelize.authenticate();
      console.log('Connection established');

      // await DB.sequelize.sync({ alter: true });
      console.log('database start');
    } catch (error) {
      console.error('Unable to connect to the database:', error);
    }
  }

  private startRoutes(routes: any[]) {
    routes.forEach((route: any) => {
      this.app.use('/api/v1', route.router);
    });
  }

  public listen() {
    this.server = this.app.listen(this.port, '0.0.0.0', () => {
      console.log(`Server is listening on ${this.port}`);
    });
  }

  public async close() {
    if (this.server) {
      const server = this.server;
      await new Promise<void>((res, rej) => {
        server.close((err) => {
          if (!!err) return rej(err);
          return res();
        });
      });
    }
  }

  public getServer() {
    return this.server;
  }

  public registerErrorMiddleware() {
    this.app.use(errorMiddleware);
  }
}

const app = new App([authRoutes, taskRoutes, quizRoutes, homeRoutes]);
export { app };
