import { onError, onServerError, onSuccess } from "../utils/response";
import db from "../database/models";
import { Op } from "sequelize";

class RightsController {
  static async getAccessRights(req, res) {
    try {
      const creator_access = req.user.role;
      const level = await db.sm_user_levels.findOne({
        where: { creator_access },
      });
      if (!level) return onError(res, 404, "Access level not found");
      const ids = level.allowed_access.split(",");
      const rights = await db.sm_access_rights.findAll({
        where: { id: { [Op.in]: ids } },
      });
      if (rights.length < 1) return onError(res, 404, "rights not found");
      return onSuccess(res, 200, "Rights Successfully found", rights);
    } catch (err) {
      console.log(err);
      return onServerError(res);
    }
  }
}
export default RightsController;
