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
  });

  Admin.associate = (models) => {
    Admin.belongsTo(models.group_members, {
      as: "user",
      foreignKey: "phone_number",
      hooks: true,
    });
  };

  return Admin;
};
