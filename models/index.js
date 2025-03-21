const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("TskDB", "postgres", "root", {
  host: "localhost",
  dialect: "postgres",
});

const TaskModel = require("./task");
const TagModel = require("./tag");
const UserModel = require("./user");

const Task = TaskModel(sequelize);
const Tag = TagModel(sequelize);
const User = UserModel(sequelize, Sequelize.DataTypes);

Task.belongsToMany(Tag, { through: "TaskTag", as: "tags" });
Tag.belongsToMany(Task, { through: "TaskTag", as: "tasks" });

module.exports = {
  sequelize,
  Task,
  Tag,
  User,
};
