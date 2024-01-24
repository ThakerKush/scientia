import { UserSerivce } from '../services/userService';
import { Request, Response, NextFunction } from 'express';
import config from '../config';
import { base64URLEncode } from '../utils/base64';

class UserController {
  userService = new UserSerivce();

  createUser = async (request: Request, response: Response, next: NextFunction) => {
    try {
      const userData = request.body;

      const createdUser = await this.userService.signUp(userData);
      response.status(200).json(createdUser);
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
        response.status(400).send(error.message);
      } else {
        response.status(400).send('unknown error');
      }
    }
  };
  loginUser = async (request: Request, response: Response, next: NextFunction) => {
    try {
      const userData = request.body;
      const { AUTH_COOKIE_NAME } = config.constants;
      const loginData = await this.userService.login(userData);
      const cookieBuffer = base64URLEncode(loginData)
      
      response.cookie(AUTH_COOKIE_NAME, cookieBuffer, {
        httpOnly: true, // The cookie is only accessible by the server
        secure: true, // The cookie is sent only over HTTPS
        sameSite: 'none', // The cookie is included in cross-site requests
        maxAge: 1000 * 60 * 60 * 24 * 7, // The cookie expires after 7 days
      });
      response.status(200).json(loginData);
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
        response.status(400).send(error.message);
      } else {
        response.status(400).send('unknown error');
      }
    }
  };
}
export { UserController };
