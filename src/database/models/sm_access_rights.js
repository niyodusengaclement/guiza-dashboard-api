const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('sm_access_rights', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
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
      allowNull: true,
      defaultValue: 0
    },
    rank: {
      type: DataTypes.TINYINT,
      allowNull: true
    },
    css: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    on_menu: {
      type: DataTypes.ENUM('Yes','No'),
      allowNull: false,
      defaultValue: "Yes"
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
