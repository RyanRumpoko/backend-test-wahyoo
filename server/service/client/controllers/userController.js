const { User, Mutation } = require("../models/index");
const { comparePassword } = require("../helpers/bcrypt");
const { createToken } = require("../middlewares/authenticate");

class Controller {
  static register(req, res, next) {
    let inputData = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    };
    User.create(inputData)
      .then((data) => {
        res.status(201).json(data);
      })
      .catch((err) => {
        next(err);
      });
  }

  static login(req, res, next) {
    let inputData = {
      email: req.body.email,
      password: req.body.password,
    };
    User.findOne({
      where: {
        email: inputData.email,
      },
    })
      .then((data) => {
        if (!data)
          throw { name: "customError", msg: "Invalid email or password" };
        let comparePass = comparePassword(inputData.password, data.password);
        if (!comparePass)
          throw { name: "customError", msg: "Invalid email or password" };
        let accessToken = createToken({
          id: data.id,
          email: data.email,
        });
        res.status(200).json({ id: data.id, name: data.name, accessToken });
      })
      .catch((err) => {
        next(err);
      });
  }

  static getById(req, res, next) {
    User.findOne({
      where: {
        id: +req.decoded.id,
      },
    })
      .then((data) => {
        res.status(200).json(data);
      })
      .catch((err) => {
        next(err);
      });
  }

  static withdraw(req, res, next) {
    console.log("masuk withdraw");
    let inputData = {
      nominal: +req.body.nominal,
    };
    let updateBalance = 0;
    User.findOne({
      where: {
        id: req.decoded.id,
      },
    })
      .then((dataBalance) => {
        if (
          inputData.nominal > dataBalance.balance ||
          dataBalance.balance <= 0
        ) {
          throw { name: "customError", msg: "Your balance is not enough" };
        } else {
          updateBalance = dataBalance.balance - inputData.nominal;
        }
        User.update(
          { balance: updateBalance },
          { where: { id: req.decoded.id }, returning: true }
        );
      })
      .then((dataMutation) => {
        Mutation.create({
          date: Date(),
          transaction: "Withdrawal",
          differences: `- ${inputData.nominal}`,
        });
        res
          .status(200)
          .json(
            `Withdrawal Rp. ${inputData.nominal}, end balance Rp. ${updateBalance}`
          );
      })
      .catch((err) => {
        next(err);
        // console.log(err);
        // res.status(500).json(err);
      });
  }

  static deposit(req, res, next) {
    let inputData = {
      nominal: +req.body.nominal,
    };
    let updateBalance = 0;
    User.findOne({
      where: {
        id: req.decoded.id,
      },
    })
      .then((dataBalance) => {
        updateBalance = dataBalance.balance + inputData.nominal;
        User.update(
          { balance: updateBalance },
          { where: { id: req.decoded.id }, returning: true }
        );
      })
      .then((dataMutation) => {
        Mutation.create({
          date: Date(),
          transaction: "Deposit",
          differences: `+ ${inputData.nominal}`,
        });
        res
          .status(200)
          .json(
            `Deposit Rp. ${inputData.nominal}, end balance Rp. ${updateBalance}`
          );
      });
  }
}

module.exports = Controller;
