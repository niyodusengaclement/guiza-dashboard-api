import { onError, onServerError, onSuccess } from "../utils/response";
import db from "../database/models";
import { Op } from "sequelize";
import fs from "fs";
import readXlsxFile from "read-excel-file/node";
import villageFinder from "../utils/villageFinder";
import moment from "moment";

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

  static async update(req, res) {
    try {
      const { group_id } = req.params;
      const group = await db.group_meta.findOne({
        where: { group_id },
        include: [
          {
            model: db.group_members,
            as: "members",
          },
          {
            model: db.group_reasons,
            as: "reasons",
          },
        ],
      });
      if (!group) return onError(res, 404, "group not found");
      group.update(req.body);
      return onSuccess(res, 200, "Group updated Successfully", group);
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
      if (!req.files || !req.files.group_file)
        return onError(res, 400, "No file selected");
      const arr = req.files.group_file.name.split(".");
      const lastIndex = arr.length - 1;
      const extension = arr[lastIndex];
      if (extension !== "xlsx" && extension !== "xlsm")
        return onError(
          res,
          400,
          "File should be an excel with [xlsx or xlsm] extension"
        );

      const uploadedMembers = [];
      const committee = [];
      const reasons = [];
      const info = [];

      const deleteTmpFile = () => {
        if (req.files.group_file.tempFilePath) {
          fs.unlink(req.files.group_file.tempFilePath, (err) => {
            if (err) {
              // console.log("error occured", err);
            }
          });
        }
      };

      const createGroup = async (values) => {
        try {
          const village_id = await villageFinder(info[0]);
          req.body.createdby = req.user.id;
          values.group_name = info[0].group_name;
          values.meeting_place = info[0].time_and_place;
          values.meeting_frequency = info[0].meeting_frequency;
          values.province = info[0].province_name;
          values.district = info[0].district_name;
          values.sector = info[0].sector_name;
          values.cell = info[0].cell_name;
          values.village = info[0].village_name;
          values.village_id = village_id;
          values.formation_time = info[0].formation_time;
          values.createdby = req.user.id;
          const createdGroup = await db.group_meta.create(values);
          if (!createdGroup) {
            return onServerError(res);
          }

          const createdMembers = await db.group_members.bulkCreate(
            uploadedMembers.map((row) => {
              row.group_id = createdGroup.dataValues.group_id;
              return row;
            })
          );

          const createdAdmins = await db.Admin.bulkCreate(
            committee.map((row) => {
              row.group_id = createdGroup.dataValues.group_id;
              return row;
            })
          );

          const createdReasons = await db.group_reasons.bulkCreate(
            reasons.map((row) => {
              row.group_id = createdGroup.dataValues.group_id;
              return row;
            })
          );
          if (
            createdGroup &&
            createdReasons &&
            createdMembers &&
            createdAdmins
          ) {
            deleteTmpFile();
            return onSuccess(res, 200, "Group Created Successfully");
          }
        } catch (err) {
          deleteTmpFile();
          err.fileName = req.files.group_file.name;
          return onServerError(res, err);
        }
      };

      const getMembersInfo = async () => {
        const isTrue = await readXlsxFile(req.files.group_file.tempFilePath, {
          sheet: 1,
        })
          .then((rows) => {
            try {
              rows.map((row, index) => {
                if (index >= 5 && row[1] !== null) {
                  const m_status = row[7] ? row[7].toLowerCase() : row[7];
                  const phone_number =
                    row[6] !== null && row[6][0] === "0"
                      ? `25${row[6]}`
                      : row[6];
                  const marital_status =
                    m_status === "arubatse"
                      ? "Married"
                      : m_status === "ingaragu"
                      ? "Single"
                      : m_status;
                  const rowFormat = {
                    first_name: row[1],
                    last_name: row[2],
                    nid: row[3],
                    dob: moment.isDate(row[4]) ? row[4] : null,
                    gender: row[5],
                    phone_number,
                    marital_status,
                  };
                  uploadedMembers.push(rowFormat);
                }
              });

              if (rows.length) {
                const g_name = rows[0][0].split(":");
                const time_and_place =
                  rows[0][1] !== null
                    ? rows[0][1].split(":")
                    : rows[0][3].split(":");

                const sector_name =
                  rows[0][2] !== null
                    ? rows[0][2].split(":")
                    : rows[0][7].split(":");

                const formation_time =
                  rows[1] !== null && rows[1][0] !== null
                    ? rows[1][0].split(":")
                    : null;

                const p_name =
                  rows[1][1] !== null
                    ? rows[1][1].split(":")
                    : rows[1][3].split(":");

                const cell_name =
                  rows[1][1] !== null
                    ? rows[1][2].split(":")
                    : rows[1][7].split(":");

                const frequency = rows[2][0].split(":");
                const district_name =
                  rows[2][1] !== null
                    ? rows[2][1].split(":")
                    : rows[2][3].split(":");
                const v_name =
                  rows[2][2] !== null
                    ? rows[2][2].split(":")
                    : rows[2][7].split(":");

                const group_Info = {
                  group_name: g_name[1],
                  time_and_place:
                    time_and_place.length > 2
                      ? `${time_and_place[1]}:${time_and_place[2]}`
                      : time_and_place[1],
                  sector_name: sector_name[1],

                  formation_time:
                    formation_time !== null ? formation_time[1].trim() : null,
                  province_name: p_name[1],
                  cell_name: cell_name[1],

                  meeting_frequency: frequency[1],
                  district_name: district_name[1],
                  village_name: v_name[1],
                };
                info.push(group_Info);
              }
              return true;
            } catch (err) {
              deleteTmpFile();
              err.fileName = req.files.group_file.name;
              return onServerError(res, err);
            }
          })
          .catch((err) => {
            return false;
          });
        return isTrue;
      };

      const getRulesInfo = async () => {
        const isTrue = await readXlsxFile(req.files.group_file.tempFilePath, {
          sheet: 2,
        })
          .then((rulesData) => {
            try {
              if (rulesData.length) {
                const savingInfo = {
                  share_value: rulesData[2][2],
                  max_weekly_shares: rulesData[3][2],
                  socialfund_amount: rulesData[6][2],

                  loan_to_savings_ratio: rulesData[12][2],
                  interest_rate: Number.isInteger(rulesData[13][2])
                    ? rulesData[13][2]
                    : rulesData[13][2] * 100,
                  max_loan_duration: rulesData[14][2],
                };
                rulesData.map((rulesData, idx) => {
                  if (idx >= 7 && idx <= 9) {
                    const socialfund_reason = {
                      reason_type: "social fund",
                      reason_description: rulesData[1],
                      reason_amount:
                        rulesData[2] !== null && Number.isInteger(rulesData[2])
                          ? rulesData[2]
                          : 0,
                    };

                    reasons.push(socialfund_reason);
                  } else if (idx >= 17 && idx <= 19 && idx > 16) {
                    const fine_reason = {
                      reason_type: "fine",
                      reason_description: rulesData[1],
                      reason_amount:
                        rulesData[2] !== null && Number.isInteger(rulesData[2])
                          ? rulesData[2]
                          : 0,
                    };
                    reasons.push(fine_reason);
                  }
                });
                createGroup(savingInfo);
              }
              return true;
            } catch (err) {
              deleteTmpFile();
              err.fileName = req.files.group_file.name;
              return onServerError(res, err);
            }
          })
          .catch((err) => {
            return false;
          });
        return isTrue;
      };

      const getAdminsInfo = async () => {
        const isTrue = await readXlsxFile(req.files.group_file.tempFilePath, {
          sheet: 3,
        })
          .then((adminData) => {
            try {
              if (adminData.length) {
                adminData.map((row, index) => {
                  if (index >= 1 && row[2] !== null && row[2][0] === "0") {
                    const phone_number =
                      row[2][0] === "0" ? `25${row[2]}` : row[2];
                    committee.push({ phone_number });
                  } else if (
                    index >= 1 &&
                    row[2] !== null &&
                    row[2][0] !== "0" &&
                    row[3] !== null
                  ) {
                    const phone_number =
                      row[3][0] === "0" ? `25${row[3]}` : row[3];
                    committee.push({ phone_number });
                  }
                });
              }
              return true;
            } catch (err) {
              deleteTmpFile();
              err.fileName = req.files.group_file.name;
              return onServerError(res, err);
            }
          })
          .catch((err) => {
            return false;
          });
        return isTrue;
      };

      const func1 = await getMembersInfo();
      const func2 = await getAdminsInfo();
      const func3 = await getRulesInfo();
      if (!func1 || !func2 || !func3) {
        const sheetFounded = `sheet 1: ${func1}, sheet 2: ${func2}, sheet 3: ${func3}`;
        deleteTmpFile();
        const err = new Error(
          `Invalid file sheets, check whether file contains all sheets. Sheets found are: ${sheetFounded}`
        );
        err.fileName = req.files.group_file.name;
        return onServerError(res, err);
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
export default GroupsController;
