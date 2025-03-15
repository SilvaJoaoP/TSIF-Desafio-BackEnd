const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');

class User extends Model {
  static init(sequelize) {
    super.init({
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING
    }, {
      sequelize,
      hooks: {
        beforeSave: async (user) => {
          if (user.password) {
            user.password = await bcrypt.hash(user.password, 8);
          }
        }
      }
    });
  }

  // Define associations if needed
  static associate(models) {
    // Example: this.hasMany(models.Task);
  }

  // Method to check if password is valid
  checkPassword(password) {
    return bcrypt.compare(password, this.password);
  }
}

module.exports = User;