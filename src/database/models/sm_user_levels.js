const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('sm_user_levels', {
    access_denotor: {
      type: DataTypes.STRING(45),
      allowNull: false,
      primaryKey: true
    },
    access_name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    creator_access: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    allowed_access: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    default_menu: {
      type: DataTypes.STRING(255),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'sm_user_levels',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "access_denotor" },
        ]
      },
    ]
  });
};
