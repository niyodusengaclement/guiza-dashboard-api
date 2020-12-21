import { onError, onServerError, onSuccess } from "../utils/response";
import db from "../database/models";

class CommentsController {
  static async findAll(req, res) {
    try {
      const { page, size, group_id } = req.query;
      const limit = !size ? 10 : +size;
      const offset = !size || !page ? 0 : page * size;

      const comments = await db.Comment.findAndCountAll({
        where: { group_id },
        order: [["id", "ASC"]],
        offset,
        limit,
        include: [
          {
            model: db.user_accounts,
            as: "sender",
            attributes: { exclude: ["password"] },
          },
        ],
      });
      const currentPage = page ? +page : 0;
      const totalPages = Math.ceil(comments.count / limit);
      const results = {
        currentPage,
        totalPages,
        totalItems: comments.count,
        itemsPerPage: limit,
        rows: comments.rows,
      };
      return onSuccess(res, 200, "comments Successfully found", results);
    } catch (err) {
      return onServerError(res, err);
    }
  }

  static async create(req, res) {
    try {
      const comment = await db.Comment.create(req.body);
      if (!comment) return onServerError(res);
      return onSuccess(res, 201, "Created Successfully", comment);
    } catch (err) {
      return onServerError(res, err);
    }
  }

  static async findOne(req, res) {
    try {
      const { comment_id } = req.params;
      const comment = await db.Comment.findOne({
        where: { id: comment_id },
      });
      if (!comment) return onError(res, 404, "comment not found");
      return onSuccess(res, 200, "comment Successfully found", comment);
    } catch (err) {
      return onServerError(res, err);
    }
  }

  static async update(req, res) {
    try {
      const { comment_id } = req.params;
      const comment = await db.Comment.findOne({
        where: { id: comment_id },
      });
      if (!comment) return onError(res, 404, "comment not found");
      comment.update(req.body);
      return onSuccess(res, 200, "comment updated Successfully", comment);
    } catch (err) {
      return onServerError(res, err);
    }
  }

  static async delete(req, res) {
    try {
      const { comment_id } = req.params;
      const comment = await db.Comment.findOne({
        where: { id: comment_id },
      });
      if (!comment) return onError(res, 404, "comment not found");
      await comment.destroy();
      return onSuccess(res, 200, "comment Successfully deleted");
    } catch (err) {
      return onServerError(res, err);
    }
  }
}
export default CommentsController;
