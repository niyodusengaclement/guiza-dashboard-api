const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  const vnd_ussd_choices = sequelize.define(
    "vnd_ussd_choices",
    {
      record_id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      ussd_state: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      ussd_choice: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      ussd_name: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      ussd_new_state: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("Active", "Inactive"),
        allowNull: false,
        defaultValue: "Inactive",
      },
      lastupdated: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "vnd_ussd_choices",
      timestamps: false,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [{ name: "record_id" }],
        },
      ],
    }
  );
  vnd_ussd_choices.associate = function (models) {
    vnd_ussd_choices.belongsTo(models.vnd_ussd_states, {
      foreignKey: "ussd_state",
      as: "current_state",
    });
  };
  return vnd_ussd_choices;
};
