import { homeService } from '../services/homeService';
import { z } from 'zod';
import config from '../config';
import { HttpError } from '../errs/HttpError';
import { Request, Response, NextFunction } from 'express';

class HomeController {
  homeService = new homeService();

  getHome = async (request: any, response: any, next: any) => {
    try {
      
      const schema = z.enum([config.constants.TASK_TYPE.MATH, config.constants.TASK_TYPE.THEORY]).nullish();
      console.log(request.params.catogery);
      await schema.parseAsync(request.params.catogery).catch((error) => {
        throw new HttpError(400, 'Invalid catogery');
      });
      const home = await this.homeService.getHome(request.params.catogery);

      response.status(200).json(home);
    } catch (error) {
      next(error);
    }
  };
}

export { HomeController };
