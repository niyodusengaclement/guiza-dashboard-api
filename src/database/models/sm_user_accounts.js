const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "sm_user_accounts",
    {
      user_id: {
        autoIncrement: true,
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
      },
      full_name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      username: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      role: {
        type: DataTypes.STRING(4),
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("Active", "Suspended", "Closed"),
        allowNull: false,
        defaultValue: "Active",
      },
    },
    {
      sequelize,
      tableName: "sm_user_accounts",
      timestamps: false,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [{ name: "user_id" }],
        },
      ],
    }
  );
};
