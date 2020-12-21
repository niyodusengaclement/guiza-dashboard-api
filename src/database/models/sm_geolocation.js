const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('sm_geolocation', {
    village_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    village_name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    cell_id: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    cell_name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    sector_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    sector_name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    district_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    district_name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    province_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    province_name: {
      type: DataTypes.STRING(255),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'sm_geolocation',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "village_id" },
        ]
      },
    ]
  });
};
