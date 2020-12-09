const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('vnd_log_session_data', {
    record_id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    session_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    session_id: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    telephone_number: {
      type: DataTypes.STRING(15),
      allowNull: false
    },
    group_code: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    session_language_pref: {
      type: DataTypes.STRING(5),
      allowNull: false
    },
    session_execution_log_file: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    session_status: {
      type: DataTypes.ENUM('active','closed','expired'),
      allowNull: false,
      defaultValue: "active"
    },
    session_close_date: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'vnd_log_session_data',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "record_id" },
        ]
      },
    ]
  });
};
