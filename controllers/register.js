const DBConnection = require("../database/DBConnection");
const { ManagementClient } = require("auth0");

const getRegisterPage = async (req, res, next) => {
  res.render("./pages/register", {
    title: "Register",
    layout: "./layouts/register",
    path: "register",
  });
};

const registerUser = async (req, res, next) => {
    console.log("Registering user");
    res.status(200).send()
};

module.exports = {
  getRegisterPage,
  registerUser,
};
