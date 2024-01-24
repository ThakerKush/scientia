import { DB } from '../db/models/index';
import bcrypt from 'bcrypt';
import { HttpError } from '../errs/HttpError';
import { Op } from 'sequelize';
import jwt from 'jsonwebtoken';
import config from '../config';
import { userData } from '../interfaces';
import { v4 as uuidv4 } from 'uuid';

class UserSerivce {
  User = DB.user;
  saultRouds = 10;
  signUp = async (userData: userData) => {
    try {
      const foundUser = await this.User.findOne({
        where: { [Op.or]: [{ username: userData.username }, { email: userData.email }] },
      });

      if (foundUser) {
        throw new HttpError(409, `The user already exists`);
      }

      const hashedPassword = await bcrypt.hash(userData.password, this.saultRouds);
      const uuid = uuidv4();
      const createdUser = await this.User.create({
        username: userData.username,
        uuid,
        email: userData.email,
        password: hashedPassword,
      });

      return createdUser;
    } catch (error) {
      console.error('[User Service] Error while signing up user', error);
      throw error;
    }
  };

  login = async (userData: userData) => {
    try {
      const {
        TOKEN_TYPE: { ACCESS, REFRESH },
      } = config.constants;

      const usernameOrEmail = userData.usernameOrEmail;
      if (!usernameOrEmail) {
        throw new HttpError(409, `UserName or Email not provided.`);
      }

      const user = await this.User.findOne({
        where: {
          [Op.or]: [{ username: userData.usernameOrEmail }, { email: userData.usernameOrEmail }],
        },
      });

      if (!user) {
        throw new HttpError(409, 'Not a valid user');
      }

      const DBpassword = user.password;
      const hashedPassword = await bcrypt.compare(userData.password, DBpassword);

      if (hashedPassword) {
        const cookieUser = { id: user.id, username: user.username };
        const accessToken = jwt.sign({ user: cookieUser, type: ACCESS }, config.HSECRET, {
          expiresIn: 60 * 60 * 2, // 2 hours
        });

        const refreshToken = jwt.sign({ user: cookieUser, type: REFRESH }, config.HSECRET, {
          expiresIn: 60 * 60 * 24 * 7, // 7 days
        });

        const loginData = {
          accessToken: accessToken,
          refreshToken: refreshToken,
        };

        return loginData;
      } else {
        throw new HttpError(409, 'Wrong Password!');
      }
    } catch (error) {
      console.error('[User Service] Error while loging in user', error);
      throw error;
    }
  };
}

export { UserSerivce };
