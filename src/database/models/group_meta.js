const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  const group_meta = sequelize.define(
    "group_meta",
    {
      date_created: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("current_timestamp"),
      },
      group_id: {
        autoIncrement: true,
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
      },
      group_name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      day_of_meeting: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      time_of_meeting: {
        type: DataTypes.STRING(5),
        allowNull: true,
      },
      share_value: {
        type: DataTypes.DECIMAL(15, 4),
        allowNull: false,
      },
      max_weekly_shares: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      socialfund_amount: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      loan_to_savings_ratio: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      interest_rate: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      max_loan_duration: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      group_status: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: "new",
      },
      group_code: {
        type: DataTypes.INTEGER,
        allowNull: true,
        unique: "group_code",
      },
      village_id: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      org_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        defaultValue: 10100006,
      },
      createdby: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      meeting_place: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      formation_time: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      province: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      district: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      sector: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      cell: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      village: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      meeting_frequency: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      production_group_id: {
        type: DataTypes.BIGINT,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: "group_meta",
      timestamps: false,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [{ name: "group_id" }],
        },
        {
          name: "group_code",
          unique: true,
          using: "BTREE",
          fields: [{ name: "group_code" }],
        },
      ],
    }
  );

  group_meta.associate = function (models) {
    group_meta.hasMany(models.group_members, {
      as: "members",
      foreignKey: "group_id",
      onDelete: "cascade",
      hooks: true,
    });
    group_meta.hasMany(models.group_reasons, {
      as: "reasons",
      foreignKey: "group_id",
      onDelete: "cascade",
      hooks: true,
    });
    group_meta.belongsTo(models.sm_geolocation, {
      as: "location",
      foreignKey: "village_id",
      hooks: true,
    });
    group_meta.belongsTo(models.mvd_organizations, {
      as: "organization",
      foreignKey: "org_id",
      hooks: true,
    });
    group_meta.hasMany(models.Comment, {
      as: "comments",
      foreignKey: "group_id",
      onDelete: "cascade",
      hooks: true,
    });
    group_meta.hasMany(models.Approval, {
      as: "approvals",
      foreignKey: "group_id",
      onDelete: "cascade",
      hooks: true,
    });
    group_meta.hasMany(models.Admin, {
      as: "admins",
      foreignKey: "group_id",
      onDelete: "cascade",
      hooks: true,
    });
    group_meta.belongsTo(models.user_accounts, {
      as: "owner",
      foreignKey: "createdBy",
      hooks: true,
      onDelete: "cascade",
    });
  };

  return group_meta;
};
