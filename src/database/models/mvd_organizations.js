const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('mvd_organizations', {
    org_id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    org_name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    org_address: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    contact_person: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    telephone_no: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    email_address: {
      type: DataTypes.STRING(255),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'mvd_organizations',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "org_id" },
        ]
      },
    ]
  });
};
