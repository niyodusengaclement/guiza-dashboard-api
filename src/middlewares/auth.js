import jwt from 'jsonwebtoken';
import { onError } from '../utils/response';

class Authentication {
  async checkToken(req, res, next) {
    const token = req.header('x-auth-token');
    if (!token) {
      return onError(res, 401, 'No token provided! Provide token and try again')
    }
    try {
      const decoded = jwt.verify(token, process.env.JWT_TOKEN);
      req.user = decoded;
      return next();
    } catch (err) {
      return onError(res, 401, 'Invalid token provided, check your token please')
    }
  }

}

export default new Authentication();