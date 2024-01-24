import jwt from 'jsonwebtoken';
import { DB } from '../db/models/index';
import config from '../config';
import { base64URLDecode, base64URLEncode } from '../utils/base64';
import { HttpError } from '../errs/HttpError';

const authenticate = async (request: any, response: any, next: any) => {
  const {
    TOKEN_TYPE: { ACCESS },
    AUTH_COOKIE_NAME,
  } = config.constants;
  const token = request.cookies[AUTH_COOKIE_NAME];
  if (!token) {
    response.status(400).send('AUTH COOKIE NOT FOUND');
  }
  try {
    const decodedToken: any = base64URLDecode(token);
    console.log(decodedToken);
    const { accessToken, refreshToken } = decodedToken;

    const accessVerify: any = await new Promise((resolve, reject) => {
      // put function
      jwt.verify(accessToken, config.HSECRET, (err: any, decoded: any) => {
        if (err) {
          resolve(null);
        } else {
          resolve(decoded);
        }
      });
    });

    if (accessVerify) {
      console.log(accessVerify);
      request.user = accessVerify.user;
    } else {
      const refreshVerify: any = await new Promise((resolve, reject) => {  // put function
        jwt.verify(refreshToken, config.HSECRET, (err: any, decoded: any) => {
          if (err) {
            resolve(null);
          } else {
            resolve(decoded);
          }
        });
      });
      
      if (!refreshVerify) {
        throw new HttpError(400, 'INVALID_JWT');
      }

      const { user } = refreshVerify;

      const newAccessToken = jwt.sign({ user, type: ACCESS }, config.HSECRET, {
        expiresIn: 60 * 60 * 2, // 2 hours
      });

      request.user = user;

      const tokenPayload = {
        accessToken: newAccessToken,
        refreshToken: refreshToken,
      };
      const cookieBuffer = base64URLEncode(tokenPayload);

      response.cookie(AUTH_COOKIE_NAME, cookieBuffer, {
        httpOnly: true, // The cookie is only accessible by the server
        secure: true, // The cookie is sent only over HTTPS
        sameSite: 'none', // The cookie is included in cross-site requests
        maxAge: 1000 * 60 * 60 * 24 * 7, // The cookie expires after 7 days
      });
    }

    next();
  } catch (error) {
    console.log(error);
  }
};

//     if (!user) {
//       response.status(400).send('user not found');
//     } else {
//       request.user = user;
//       next();
//     }
//   } catch (error: any) {
//     if (error['message'] === 'jwt expired') {
//       response.status(400).send('JWT_EXPIRED');
//     } else {
//       response.status(400).send('INVALID_JWT');
//     }
//   }
// };

export default authenticate;
