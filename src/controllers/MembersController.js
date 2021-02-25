import fs from "fs";
import readXlsxFile from "read-excel-file/node";
import { onError, onServerError, onSuccess } from "../utils/response";
import db from "../database/models";
import { Op } from "sequelize";
import MembersValidations from "../validations/MembersValidations";

class membersController {
  static async findAll(req, res) {
    try {
      const { page, size, group_id } = req.query;
      const limit = !size ? 10 : +size;
      const offset = !size || !page ? 0 : page * size;

      const members = await db.group_members.findAndCountAll({
        where: { group_id },
        order: [["member_id", "DESC"]],
        offset,
        limit,
      });
      const currentPage = page ? +page : 0;
      const totalPages = Math.ceil(members.count / limit);
      const results = {
        currentPage,
        totalPages,
        totalItems: members.count,
        itemsPerPage: limit,
        rows: members.rows,
      };
      return onSuccess(res, 200, "members Successfully found", results);
    } catch (err) {
      return onServerError(res, err);
    }
  }

  static async search(req, res) {
    try {
      const { page, size, searchHint, group_id } = req.query;
      const limit = !size ? 10 : +size;
      const offset = !size || !page ? 0 : page * size;

      const groups = await db.group_members.findAndCountAll({
        where: {
          [Op.and]: [{ group_id }],
          [Op.or]: [
            {
              member_id: {
                [Op.substring]: searchHint,
              },
            },
            {
              first_name: {
                [Op.substring]: searchHint,
              },
            },
            {
              last_name: {
                [Op.substring]: searchHint,
              },
            },
            {
              nid: {
                [Op.substring]: searchHint,
              },
            },
            {
              phone_number: {
                [Op.substring]: searchHint,
              },
            },
          ],
        },
        order: [["member_id", "DESC"]],
        offset,
        limit,
      });
      const currentPage = page ? +page : 0;
      const totalPages = Math.ceil(groups.count / limit);
      const results = {
        currentPage,
        totalPages,
        totalItems: groups.count,
        itemsPerPage: limit,
        rows: groups.rows,
      };
      return onSuccess(res, 200, "Groups Successfully found", results);
    } catch (err) {
      return onServerError(res, err);
    }
  }

  static async create(req, res) {
    try {
      const member = await db.group_members.create(req.body);
      if (!member) return onServerError(res);
      return onSuccess(res, 201, "member Created Successfully", member);
    } catch (err) {
      return onServerError(res, err);
    }
  }

  static async findOne(req, res) {
    try {
      const { member_id } = req.params;
      const member = await db.group_members.findOne({
        where: { member_id },
      });

      if (!member) return onError(res, 404, "Member not found");
      return onSuccess(res, 200, "member Successfully found", member);
    } catch (err) {
      return onServerError(res, err);
    }
  }

  static async update(req, res) {
    try {
      const { member_id } = req.params;
      const member = await db.group_members.findOne({
        where: { member_id },
      });
      if (!member) return onError(res, 404, "member not found");
      member.update(req.body);
      return onSuccess(res, 200, "member updated Successfully", member);
    } catch (err) {
      return onServerError(res, err);
    }
  }

  static async delete(req, res) {
    try {
      const { member_id } = req.params;
      const member = await db.group_members.findOne({
        where: { member_id },
      });
      if (!member) return onError(res, 404, "member not found");
      await member.destroy();
      return onSuccess(res, 200, "member Successfully deleted");
    } catch (err) {
      return onServerError(res, err);
    }
  }

  static async uploadMembers(req, res) {
    try {
      const { group_id } = req.params;
      const { rows, errors } = await readXlsxFile(
        req.files.members_file.tempFilePath,
        { schema: MembersValidations.fileColumns() }
      );
      if (errors && errors.length > 0)
        return onError(res, 400, "Uploaded file has error(s)");
      if (rows && rows.length > 0) {
        const response = await db.group_members.bulkCreate(
          rows.map((row) => {
            row.group_id = group_id;
            return row;
          }),
          {
            validate: true,
          }
        );

        fs.unlink(req.files.members_file.tempFilePath, (err) => {
          if (err) {
            // console.log("error occured");
          }
        });
        return onSuccess(res, 201, "Members successfully uploaded", response);
      }
    } catch (err) {
      if (err.name === "SequelizeUniqueConstraintError")
        return onError(
          res,
          409,
          "This file contains One or more phone number already exists in this group"
        );
      return onServerError(res, err);
    }
  }
}
export default membersController;
