import bcrypt from "bcrypt";
import helpers from "../utils/helpers";
import { onError, onServerError, onSuccess } from "../utils/response";
import db from "../database/models";

class UsersController {
  static async login(req, res) {
    try {
      const { username, password } = req.body;
      if (!username || !password)
        return onError(res, 400, "Fill all required fields please");
      const user = await db.user_accounts.findOne({
        where: { username },
      });
      if (!user) {
        return onError(res, 401, "Wrong username or password");
      }
      const compare = await bcrypt.compare(password, user.password);
      if (!compare) return onError(res, 401, "Wrong username or password");

      const token = await helpers.tokenGenerator(user);
      return onSuccess(res, 200, "Login Successfully", token);
    } catch (err) {
      return onServerError(res, err);
    }
  }

  static async register(req, res) {
    try {
      const {
        username,
        password: inputPassword,
        name,
        access_level,
        org_id,
      } = req.body;
      const password = await helpers.hashPassword(inputPassword);
      const user = await db.user_accounts.create({
        username,
        password,
        name,
        access_level,
        org_id,
      });
      if (!user) {
        return onServerError(res);
      }
      const token = await helpers.tokenGenerator(user);
      return onSuccess(res, 201, "Created Successfully", token);
    } catch (err) {
      return onServerError(res, err);
    }
  }
}
export default UsersController;
