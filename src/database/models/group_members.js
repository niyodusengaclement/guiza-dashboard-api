const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  const group_members = sequelize.define(
    "group_members",
    {
      date_created: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("current_timestamp"),
      },
      member_id: {
        autoIncrement: true,
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
      },
      group_id: {
        type: DataTypes.BIGINT,
        allowNull: true,
      },
      first_name: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      last_name: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      nid: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      dob: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      gender: {
        type: DataTypes.STRING(6),
        allowNull: true,
      },
      phone_number: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      marital_status: {
        type: DataTypes.STRING(10),
        allowNull: true,
      },
      is_admin: {
        type: DataTypes.TINYINT,
        allowNull: true,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      tableName: "group_members",
      timestamps: false,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [{ name: "member_id" }],
        },
      ],
    }
  );
  group_members.associate = function (models) {
    group_members.belongsTo(models.Admin, {
      as: "user",
      foreignKey: "phone_number",
      hooks: true,
      onDelete: "cascade",
    });
  };
  return group_members;
};
