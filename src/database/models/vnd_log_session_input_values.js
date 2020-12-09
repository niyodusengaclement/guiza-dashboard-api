const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('vnd_log_session_input_values', {
    record_id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    session_id: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    state_id: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    telephone_number: {
      type: DataTypes.STRING(15),
      allowNull: false
    },
    input_name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    input_value: {
      type: DataTypes.STRING(255),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'vnd_log_session_input_values',
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
