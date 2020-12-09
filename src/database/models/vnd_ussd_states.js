const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  const vnd_ussd_states = sequelize.define(
    "vnd_ussd_states",
    {
      state_id: {
        autoIncrement: true,
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
      },
      state_type: {
        type: DataTypes.ENUM("menuchoice", "input"),
        allowNull: false,
        defaultValue: "menuchoice",
      },
      state_title: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      state_indicator: {
        type: DataTypes.ENUM("FC", "FB"),
        allowNull: false,
        defaultValue: "FC",
      },
      input_type: {
        type: DataTypes.ENUM("numeric", "alphanumeric", "alphabetic"),
        allowNull: false,
        defaultValue: "numeric",
      },
      input_field_name: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      text_en: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      text_fr: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      text_kin: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      fxn_call_flag: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      call_fxn_name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      api_call_flag: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      api_endpoint: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      request_method: {
        type: DataTypes.ENUM("GET", "POST"),
        allowNull: true,
      },
      request_params: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      code: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      fxn_type: {
        type: DataTypes.ENUM(
          "api_triggering",
          "non_referencing",
          "referencing"
        ),
        allowNull: true,
      },
      default_resp_code: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      referenced_fields: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("failed", "successful"),
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "vnd_ussd_states",
      timestamps: false,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [{ name: "state_id" }],
        },
      ],
    }
  );
  vnd_ussd_states.associate = function (models) {
    vnd_ussd_states.hasMany(models.vnd_ussd_choices, {
      as: "choices",
      foreignKey: "ussd_state",
      onDelete: "cascade",
      hooks:true
    });
  };
  return vnd_ussd_states;
};
