module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define("Comment", {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Please enter USER ID",
        },
      },
    },
    group_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Please enter GROUP ID",
        },
      },
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Please enter your comment",
        },
      },
    },
  });

  Comment.associate = (models) => {
    Comment.belongsTo(models.user_accounts, {
      as: "sender",
      foreignKey: "user_id",
      hooks: true,
    });
  };

  return Comment;
};
