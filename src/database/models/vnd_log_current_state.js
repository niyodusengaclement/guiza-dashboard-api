const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('vnd_log_current_state', {
    record_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.fn('current_timestamp')
    },
    record_id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    session_id: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    telephone_number: {
      type: DataTypes.STRING(13),
      allowNull: false
    },
    previous_state: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    current_state: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    last_updated: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'vnd_log_current_state',
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
