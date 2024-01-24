import { Router } from 'express';
import authenticate from '../middleware/authenticate';
import { validate } from '../middleware/validate';
import { HomeController } from '../controller/homeController';
import { z } from 'zod';
import constants from '../config/constants';

class HomeRoutes {
  public path = '/home';
  public router;
  public homeCont;

  constructor() {
    this.homeCont = new HomeController();
    this.router = Router();
    this.startRoutes();
  }
  private startRoutes() {
    this.router.get(`${this.path}/:catogery?`, authenticate, this.homeCont.getHome);
  }
}

export { HomeRoutes };
