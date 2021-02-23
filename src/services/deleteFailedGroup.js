import db from "../database/models";

export default async (group_id) => {
  try {
    await db.group_members.destroy({
      where: {
        group_id,
      },
    });
    await db.group_reasons.destroy({
      where: {
        group_id,
      },
    });
    await db.Admin.destroy({
      where: {
        group_id,
      },
    });
    await db.group_meta.destroy({
      where: {
        group_id,
      },
    });
    return true;
  } catch (error) {
    return null;
  }
};
