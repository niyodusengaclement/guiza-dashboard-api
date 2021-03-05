const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "group_reasons",
    {
      group_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      reason_id: {
        autoIncrement: true,
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
      },
      reason_type: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      reason_description: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      reason_amount: {
        type: DataTypes.DECIMAL(15, 4),
        allowNull: false,
      },
      production_group_id: {
        type: DataTypes.BIGINT,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: "group_reasons",
      timestamps: false,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [{ name: "reason_id" }],
        },
      ],
    }
  );
};
