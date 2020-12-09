const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('sm_access_rights', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    menu_type: {
      type: DataTypes.ENUM('single','multilevel'),
      allowNull: false,
      defaultValue: "single"
    },
    menu_title: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    load_page: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    parent_option: {
      type: DataTypes.TINYINT,
      allowNull: true
    },
    rank: {
      type: DataTypes.TINYINT,
      allowNull: true
    },
    on_menu: {
      type: DataTypes.ENUM('Yes','No'),
      allowNull: false
    },
    css: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'sm_access_rights',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
