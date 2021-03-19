import { sequelize } from "../database/models";

export default async () => {
  try {
    await sequelize.query(
      "UPDATE group_members INNER JOIN group_meta ON group_members.group_id = group_meta.group_id SET group_members.production_group_id = group_meta.production_group_id WHERE group_members.production_group_id IS NULL",
      { type: sequelize.QueryTypes.UPDATE }
    );

    await sequelize.query(
      "UPDATE Admins INNER JOIN group_meta ON Admins.group_id = group_meta.group_id SET Admins.production_group_id = group_meta.production_group_id WHERE Admins.production_group_id IS NULL",
      { type: sequelize.QueryTypes.UPDATE }
    );

    await sequelize.query(
      "UPDATE group_reasons INNER JOIN group_meta ON group_reasons.group_id = group_meta.group_id SET group_reasons.production_group_id = group_meta.production_group_id WHERE group_reasons.production_group_id IS NULL",
      { type: sequelize.QueryTypes.UPDATE }
    );
  } catch (error) {
    return { error };
  }
};
