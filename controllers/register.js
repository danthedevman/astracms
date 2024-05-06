const DBConnection = require("../database/DBConnection");

const getRegisterPage = async (req, res, next) => {
  res.render("./pages/register", {
    title: "Register",
    layout: "./layouts/register",
    path: "register",
  });
};

const registerUser = async (req, res, next) => {};

module.exports = {
  getRegisterPage,
  registerUser,
};
