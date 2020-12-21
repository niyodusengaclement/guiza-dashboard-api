const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  const user_accounts = sequelize.define(
    "user_accounts",
    {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(60),
        allowNull: false,
      },
      username: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: "username",
      },
      password: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      access_level: {
        type: DataTypes.STRING(11),
        allowNull: false,
        defaultValue: "3",
      },
      org_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        defaultValue: 10100002,
      },
      cluster: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("current_timestamp"),
      },
    },
    {
      sequelize,
      tableName: "user_accounts",
      timestamps: false,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [{ name: "id" }],
        },
        {
          name: "username",
          unique: true,
          using: "BTREE",
          fields: [{ name: "username" }],
        },
      ],
    }
  );
  user_accounts.associate = function (models) {
    user_accounts.hasMany(models.group_meta, {
      as: "owner",
      foreignKey: "createdBy",
      onDelete: "cascade",
      hooks: true,
    });
  };

  return user_accounts;
};
