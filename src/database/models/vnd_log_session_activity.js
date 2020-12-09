const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('vnd_log_session_activity', {
    record_id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    request_time: {
      type: DataTypes.DATE,
      allowNull: false
    },
    transaction_id: {
      type: DataTypes.BIGINT,
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
    menu_requests: {
      type: DataTypes.STRING(255),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'vnd_log_session_activity',
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
