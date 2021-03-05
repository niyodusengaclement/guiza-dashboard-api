import { onError, onServerError, onSuccess } from "../utils/response";
import db from "../database/models";

class ReasonsController {
  static async findAll(req, res) {
    try {
      const { page, size, group_id } = req.query;
      const limit = !size ? 10 : +size;
      const offset = !size || !page ? 0 : page * size;

      const reasons = await db.group_reasons.findAndCountAll({
        where: { group_id },
        order: [["reason_id", "DESC"]],
        offset,
        limit,
      });
      const currentPage = page ? +page : 0;
      const totalPages = Math.ceil(reasons.count / limit);
      const results = {
        currentPage,
        totalPages,
        totalItems: reasons.count,
        itemsPerPage: limit,
        rows: reasons.rows,
      };
      return onSuccess(res, 200, "reasons Successfully found", results);
    } catch (err) {
      return onServerError(res, err);
    }
  }

  static async create(req, res) {
    try {
      const reason = await db.group_reasons.create(req.body);
      if (!reason) return onServerError(res);
      return onSuccess(res, 201, "Created Successfully", reason);
    } catch (err) {
      return onServerError(res, err);
    }
  }

  static async migrate(req, res) {
    try {
      const reasons = await db.group_reasons.findAll();
      return onSuccess(res, 200, "Reasons Successfully found", reasons);
    } catch (err) {
      return onServerError(res, err);
    }
  }

  static async findOne(req, res) {
    try {
      const { reason_id } = req.params;
      const reason = await db.group_reasons.findOne({
        where: { reason_id },
      });
      if (!reason) return onError(res, 404, "reason not found");
      return onSuccess(res, 200, "reason Successfully found", reason);
    } catch (err) {
      return onServerError(res, err);
    }
  }

  static async update(req, res) {
    try {
      const { reason_id } = req.params;
      const reason = await db.group_reasons.findOne({
        where: { reason_id },
      });
      if (!reason) return onError(res, 404, "reason not found");
      reason.update(req.body);
      return onSuccess(res, 200, "reason updated Successfully", reason);
    } catch (err) {
      return onServerError(res, err);
    }
  }

  static async delete(req, res) {
    try {
      const { reason_id } = req.params;
      const reason = await db.group_reasons.findOne({
        where: { reason_id },
      });
      if (!reason) return onError(res, 404, "reason not found");
      await reason.destroy();
      return onSuccess(res, 200, "reason Successfully deleted");
    } catch (err) {
      return onServerError(res, err);
    }
  }
}
export default ReasonsController;
