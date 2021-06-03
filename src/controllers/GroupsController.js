import {
  onError,
  onServerError,
  onSuccess,
  logMultipleErrors,
} from "../utils/response";
import db, { sequelize } from "../database/models";
import { Op } from "sequelize";
import readMembersSheet from "../services/readMembersSheet";
import readCommitteeSheet from "../services/readCommitteeSheet";
import readRulesSheet from "../services/readRulesSheet";
import helpers from "../utils/helpers";
import createGroup from "../services/createGroup";
import updateProductionGroupIDs from "../services/updateProductionGroupIDs";
import villageFinder from "../services/villageFinder";

class GroupsController {
  static async findAll(req, res) {
    try {
      const { page, size } = req.query;
      const { access_level, id, org_id } = req.user;
      const limit = !size ? 10 : +size;
      const offset = !size || !page ? 0 : page * size;

      const groups = await db.group_meta.findAndCountAll({
        where:
          access_level === "2"
            ? { createdby: id }
            : access_level === "3"
            ? { org_id }
            : {},
        include: [
          {
            model: db.sm_geolocation,
            as: "location",
          },
          {
            model: db.mvd_organizations,
            as: "organization",
          },
        ],
        order: [["group_id", "DESC"]],
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

  static async search(req, res) {
    try {
      const { page, size, searchHint } = req.query;
      const { access_level, id, org_id } = req.user;
      const limit = !size ? 10 : +size;
      const offset = !size || !page ? 0 : page * size;

      const groups = await db.group_meta.findAndCountAll({
        include: [
          {
            model: db.sm_geolocation,
            as: "location",
          },
          {
            model: db.mvd_organizations,
            as: "organization",
          },
        ],
        where: {
          [Op.and]:
            access_level === "2"
              ? { createdby: id }
              : access_level === "3"
              ? { org_id }
              : {},
          [Op.or]: [
            {
              group_code: {
                [Op.substring]: searchHint,
              },
            },
            {
              group_name: {
                [Op.substring]: searchHint,
              },
            },
            {
              day_of_meeting: {
                [Op.substring]: searchHint,
              },
            },
            {
              time_of_meeting: {
                [Op.substring]: searchHint,
              },
            },
            {
              group_status: {
                [Op.substring]: searchHint,
              },
            },
          ],
        },
        order: [["group_id", "DESC"]],
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
      req.body.createdby = req.user.id;
      req.body.org_id = req.body.org_id || req.user.org_id;
      const group = await db.group_meta.create(req.body);
      if (!group) return onServerError(res);
      return onSuccess(res, 201, "Group Created Successfully", group);
    } catch (err) {
      return onServerError(res, err);
    }
  }

  static async findOne(req, res) {
    try {
      const { group_id } = req.params;
      const group = await db.group_meta.findOne({
        where: { group_id },
        include: [
          {
            model: db.Admin,
            as: "admins",
          },
          {
            model: db.group_members,
            as: "members",
          },
          {
            model: db.group_reasons,
            as: "reasons",
          },
          {
            model: db.sm_geolocation,
            as: "location",
          },
          {
            model: db.mvd_organizations,
            as: "organization",
          },
          {
            model: db.Comment,
            as: "comments",
          },
          {
            model: db.Approval,
            as: "approvals",
          },
        ],
      });
      if (!group) return onError(res, 404, "group not found");
      return onSuccess(res, 200, "group Successfully found", group);
    } catch (err) {
      return onServerError(res, err);
    }
  }

  static async migrate(req, res) {
    try {
      const groups = await db.group_meta.findAll({
        where: { group_status: "new", production_group_id: null },
        order: [["group_id", "DESC"]],
      });
      return onSuccess(res, 200, "Groups Successfully found", groups);
    } catch (err) {
      return onServerError(res, err);
    }
  }

  static async update(req, res) {
    try {
      const { group_id } = req.params;
      const group = await db.group_meta.findOne({
        where: { group_id },
      });
      if (!group) return onError(res, 404, "group not found");
      group.update(req.body);
      return onSuccess(res, 200, "Group updated Successfully", group);
    } catch (err) {
      return onServerError(res, err);
    }
  }

  static async updateMigratedGroups(req, res) {
    try {
      const { groups } = req.body;
      if (!groups || groups.length < 1)
        return onError(res, 404, "Provide an array of groups to update");

      const updatedGroups = await db.group_meta.bulkCreate(
        groups.map((row) => {
          row.date_created = new Date();
          row.production_group_id = row.group_id;
          row.group_id = row.stagging_group_id;
          row.group_code = row.group_code;
          // row.group_status = "migrated";
          return row;
        }),
        {
          updateOnDuplicate: [
            // "group_status",
            "group_code",
            "production_group_id",
          ],
        }
      );
      await updateProductionGroupIDs();
      return onSuccess(res, 200, "Groups updated Successfully", updatedGroups);
    } catch (err) {
      return onServerError(res, err);
    }
  }

  static async delete(req, res) {
    try {
      const { group_id } = req.params;
      const group = await db.group_meta.findOne({
        where: { group_id },
      });
      if (!group) return onError(res, 404, "group not found");
      await group.destroy();
      return onSuccess(res, 200, "group Successfully deleted");
    } catch (err) {
      return onServerError(res, err);
    }
  }

  static async uploadGroupInfo(req, res) {
    try {
      const { tempFilePath: filePath } = req.files.group_file;
      const {
        uploadedMembers,
        groupInfo,
        error: membersError,
      } = await readMembersSheet(filePath);

      const { committee, error: committeeError } = await readCommitteeSheet(
        filePath
      );

      const {
        reasons,
        savingInfo,
        error: rulesError,
      } = await readRulesSheet(filePath);
      if (membersError || committeeError || rulesError) {
        helpers.deleteTmpFile(filePath);
        logMultipleErrors(
          [membersError, committeeError, rulesError],
          req.files.group_file.name
        );
        return onError(
          res,
          400,
          "Uploaded file doesn't meet specifications! Check logs for more details"
        );
      }
      const groupInformation = Object.assign(groupInfo, savingInfo, {
        createdby: req.user.id,
      });
      const { data, error } = await createGroup({
        groupInformation,
        committee,
        reasons,
        uploadedMembers,
      });
      if (error) return onServerError(res, error);
      return onSuccess(res, 200, "Group successfully uploaded", data);
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

  static async villageUpdater(req, res) {
    try {
      const villageUpdate = await sequelize.query(
        "UPDATE group_meta as grp INNER JOIN sm_geolocation AS geo ON geo.district_name LIKE CONCAT('%', TRIM(grp.district), '%') AND geo.sector_name LIKE CONCAT('%', TRIM(grp.sector), '%') AND geo.cell_name LIKE CONCAT('%', TRIM(grp.cell), '%') AND geo.village_name LIKE CONCAT('%', TRIM(grp.village), '%') SET grp.village_id=geo.village_id WHERE grp.village_id IS NULL OR grp.village_id = 0",
        { type: sequelize.QueryTypes.UPDATE }
      );

      const districtUpdate = await sequelize.query(
        "UPDATE group_meta as grp INNER JOIN sm_geolocation AS geo ON geo.district_name LIKE CONCAT('%', TRIM(grp.district), '%') SET grp.village_id=geo.district_id WHERE grp.village_id IS NULL OR grp.village_id = 0",
        { type: sequelize.QueryTypes.UPDATE }
      );

      const unpdatedGroups = await db.group_meta.findAll({
        where: { village_id: null },
      });

      return onSuccess(res, 200, "group Successfully updated", {
        districtUpdate: districtUpdate[1],
        villageUpdate: villageUpdate[1],
        unpdatedGroups: unpdatedGroups?.length,
      });
    } catch (err) {
      return onServerError(res, err);
    }
  }
}

export default GroupsController;
