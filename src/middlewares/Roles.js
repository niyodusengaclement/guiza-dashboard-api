import { onError, onServerError } from "../utils/response";

class Roles {
  static async admin(req, res, next) {
    try {
      const { access_level } = req.user;
      if (+access_level !== 1) return onError(res, 403, "Access denied");
      return next();
    } catch (err) {
      return onServerError(res, err);
    }
  }
}
export default Roles;
