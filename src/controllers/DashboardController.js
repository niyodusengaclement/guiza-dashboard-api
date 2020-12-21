import { onServerError, onSuccess } from "../utils/response";
import db from "../database/models";
import sequelize, { Op } from "sequelize";

class DashboardController {
  static async index(req, res) {
    try {
      const groups = await db.group_meta.count();

      const members = await db.group_members.count();

      const male = await db.group_members.count({
        where: {
          [Op.or]: [
            {
              gender: "male",
            },
            {
              gender: "m",
            },
            {
              gender: "gabo",
            },
            {
              gender: "umugabo",
            },
          ],
        },
      });

      const sim = await db.group_members.count({
        where: {
          [Op.and]: [
            sequelize.where(
              sequelize.fn("char_length", sequelize.col("phone_number")),
              12
            ),
            {
              phone_number: {
                [Op.startsWith]: "2507",
              },
            },
          ],
        },
      });

      const clusters = [];
      await db.group_meta
        .findAndCountAll({
          group: "createdBy",
          attributes: ["createdby"],
          include: [
            {
              model: db.user_accounts,
              as: "owner",
              attributes: ["id", "name", "cluster"],
            },
          ],
        })
        .then(({ rows, count }) => {
          rows.map((row, idx) => {
            const { name, cluster } = row.owner.dataValues;
            const result = {
              groups: count[idx].count,
              name,
              cluster,
            };
            clusters.push(result);
          });
        });

      const response = {
        groups,
        members,
        male,
        female: members - male,
        sim,
        noSim: members - sim,
        clusters,
      };
      return onSuccess(res, 200, "Successfully", response);
    } catch (err) {
      return onServerError(res, err);
    }
  }
}
export default DashboardController;
