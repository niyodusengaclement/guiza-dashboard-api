module.exports = (sequelize, DataTypes) => {
  const Admin = sequelize.define("Admin", {
    phone_number: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Please enter phone_number",
        },
      },
    },
    group_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Please enter GROUP ID",
        },
      },
    },
    status: {
      type: DataTypes.STRING,
    },
    production_group_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
  });

  Admin.associate = (models) => {
    Admin.belongsTo(models.group_members, {
      as: "user",
      foreignKey: "phone_number",
      hooks: true,
    });
    Admin.belongsTo(models.group_meta, {
      as: "admins",
      foreignKey: "group_id",
      hooks: true,
    });
  };

  return Admin;
};
