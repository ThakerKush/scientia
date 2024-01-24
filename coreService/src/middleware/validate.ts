import { NextFunction, Request, Response } from 'express';

const validate = (schema: any) => {
    return async (request: Request, response: Response, next: NextFunction) => {
      try {
        await schema.parseAsync(request.body);
        return next();
      } catch (error) {
        return response.status(400).send(error);
        // next(error);
      }
    };
  };
  
  export  { validate };
  