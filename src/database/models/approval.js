module.exports = (sequelize, DataTypes) => {
  const Approval = sequelize.define("Approval", {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Please enter USER ID",
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
    approved: {
      type: DataTypes.BOOLEAN,
    },
  });

  Approval.associate = (models) => {
    Approval.belongsTo(models.user_accounts, {
      as: "user",
      foreignKey: "user_id",
      hooks: true,
    });
  };

  return Approval;
};
