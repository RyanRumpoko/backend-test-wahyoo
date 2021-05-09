"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Mutation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Mutation.belongsTo(models.User);
    }
  }
  Mutation.init(
    {
      date: DataTypes.STRING,
      transaction: DataTypes.STRING,
      differences: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Mutation",
    }
  );
  return Mutation;
};
