module.exports = (sequelize, DataTypes) => {
  const TaskTag = sequelize.define(
    "TaskTag",
    {
      TaskId: {
        type: DataTypes.UUID,
        references: {
          model: "Tasks",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      TagId: {
        type: DataTypes.UUID,
        references: {
          model: "Tags",
          key: "id",
        },
        onDelete: "CASCADE",
      },
    },
    {
      timestamps: true,
    }
  );

  return TaskTag;
};
