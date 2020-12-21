import { Op } from "sequelize";
import { onError, onServerError, onSuccess } from "../utils/response";
import db from "../database/models";

class ApprovalsController {
  static async findAll(req, res) {
    try {
      const { page, size, group_id } = req.query;
      const limit = !size ? 10 : +size;
      const offset = !size || !page ? 0 : page * size;

      const approvals = await db.Approval.findAndCountAll({
        where: {
          [Op.and]: [{ group_id }, { approved: true }],
        },
        order: [["id", "ASC"]],
        offset,
        limit,
        include: [
          {
            model: db.user_accounts,
            as: "user",
            attributes: { exclude: ["password"] },
          },
        ],
      });
      const currentPage = page ? +page : 0;
      const totalPages = Math.ceil(approvals.count / limit);
      const results = {
        currentPage,
        totalPages,
        totalItems: approvals.count,
        itemsPerPage: limit,
        rows: approvals.rows,
      };
      return onSuccess(res, 200, "approvals Successfully found", results);
    } catch (err) {
      return onServerError(res, err);
    }
  }

  static async create(req, res) {
    try {
      req.body.user_id = req.user.id;
      const existedApproval = await db.Approval.findOne({
        where: {
          [Op.and]: [{ user_id: req.user.id }, { group_id: req.body.group_id }],
        },
      });
      if (existedApproval) {
        existedApproval.update({
          approved: !existedApproval.approved,
        });
        return onSuccess(res, 201, "Approved Successfully", existedApproval);
      }
      const approval = await db.Approval.create(req.body);
      if (!approval) return onServerError(res);
      approval.approved = true;
      return onSuccess(res, 201, "Approved Successfully", approval);
    } catch (err) {
      return onServerError(res, err);
    }
  }

  static async findOne(req, res) {
    try {
      const { approval_id } = req.params;
      const approval = await db.Approval.findOne({
        where: { id: approval_id },
      });
      if (!Approval) return onError(res, 404, "Approval not found");
      return onSuccess(res, 200, "Approval Successfully found", approval);
    } catch (err) {
      return onServerError(res, err);
    }
  }

  static async update(req, res) {
    try {
      const approval = await db.Approval.findOne({
        where: {
          [Op.and]: [{ user_id: req.user.id }, { group_id: req.body.group_id }],
        },
      });
      if (!approval) return onError(res, 404, "Approval not found");
      approval.update({
        approved: !approval.approved,
      });
      return onSuccess(res, 200, "Approval updated Successfully", approval);
    } catch (err) {
      return onServerError(res, err);
    }
  }

  static async delete(req, res) {
    try {
      const { approval_id } = req.params;
      const approval = await db.Approval.findOne({
        where: { id: approval_id },
      });
      if (!Approval) return onError(res, 404, "Approval not found");
      await approval.destroy();
      return onSuccess(res, 200, "Approval Successfully deleted");
    } catch (err) {
      return onServerError(res, err);
    }
  }
}
export default ApprovalsController;
