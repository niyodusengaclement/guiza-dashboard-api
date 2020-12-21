import db from "../database/models";
import { Op } from "sequelize";

export default async (payload) => {
  try {
    const response = await db.sm_geolocation.findOne({
      where: {
        [Op.and]: [
          {
            district_name: {
              [Op.substring]: payload.district_name,
            },
          },
          {
            sector_name: {
              [Op.substring]: payload.sector_name,
            },
          },
          {
            cell_name: {
              [Op.substring]: payload.cell_name,
            },
          },
          {
            village_name: {
              [Op.substring]: payload.village_name,
            },
          },
        ],
      },
    });
    if (response && response.dataValues) {
      return response.dataValues.village_id;
    }
    return null;
  } catch (error) {
    return null;
  }
};
