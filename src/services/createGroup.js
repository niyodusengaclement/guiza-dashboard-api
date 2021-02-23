import villageFinder from "./villageFinder";
import db from "../database/models";
import deleteFailedGroup from "./deleteFailedGroup";

export default async ({
  groupInformation,
  committee,
  reasons,
  uploadedMembers,
}) => {
  const groupId = [];
  try {
    const village_id = await villageFinder(groupInformation);
    groupInformation.village_id = village_id;
    const createdGroup = await db.group_meta.create(groupInformation);
    if (!createdGroup) {
      const error = new Error("Group failed to create, please try again");
      return { error };
    }
    groupId.push(createdGroup.dataValues.group_id);
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

    if (!createdReasons || !createdMembers || !createdAdmins) {
      deleteFailedGroup(createdGroup.dataValues.group_id);
      const error = new Error(
        "Something went wrong when creating group, please try again"
      );
      return { error };
    }
    return {
      data: { createdGroup, createdReasons, createdMembers, createdAdmins },
    };
  } catch (error) {
    deleteFailedGroup(groupId[0]);
    return { error };
  }
};
