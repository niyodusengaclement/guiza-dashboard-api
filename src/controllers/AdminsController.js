import { onError, onServerError, onSuccess } from "../utils/response";
import db from "../database/models";

class AdminsController {
  static async findGroupAdmins(req, res) {
    try {
      const { page, size, group_id } = req.query;
      const limit = !size ? 10 : +size;
      const offset = !size || !page ? 0 : page * size;

      const admins = await db.Admin.findAndCountAll({
        where: { group_id },
        order: [["id", "ASC"]],
        offset,
        limit,
        include: [
          {
            model: db.group_members,
            as: "user",
            attributes: { exclude: ["password"] },
          },
        ],
      });
      const currentPage = page ? +page : 0;
      const totalPages = Math.ceil(admins.count / limit);
      const results = {
        currentPage,
        totalPages,
        totalItems: admins.count,
        itemsPerPage: limit,
        rows: admins.rows,
      };
      return onSuccess(res, 200, "admins Successfully found", results);
    } catch (err) {
      return onServerError(res, err);
    }
  }

  static async create(req, res) {
    try {
      const { phone_number, group_id } = req.body;
      const member = await db.group_members.findOne({
        where: { phone_number, group_id },
      });
      if (!member)
        return onError(res, 404, "User is not a member of this group");
      const admin = await db.Admin.create(req.body);
      if (!admin) return onServerError(res);
      return onSuccess(res, 201, "Created Successfully", admin);
    } catch (err) {
      if (err.name === "SequelizeUniqueConstraintError")
        return onError(res, 409, "Admin already exists");
      return onServerError(res, err);
    }
  }

  static async delete(req, res) {
    try {
      const { admin_id } = req.params;
      const admin = await db.Admin.findOne({
        where: { id: admin_id },
      });
      if (!admin) return onError(res, 404, "admin not found");
      await admin.destroy();
      return onSuccess(res, 200, "admin Successfully deleted");
    } catch (err) {
      return onServerError(res, err);
    }
  }
}
export default AdminsController;
