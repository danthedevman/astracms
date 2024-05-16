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
const db = await DBConnection.getDB(process.env.MAIN_DB);
await db.createCollection("sys_user");

const userExists = await db
.collection("sys_user")
.findOne({ email: req.body.email });
if(userExists){
    console.log("User already exists when registering.");
    res.status(400).send({message:"There is already an account associated to this email. Please go to the log in page to log in or reset your password."})
    return;
}

let user = await db.collection("sys_user").insertOne({
  name: String(req.body.name),
  email: String(req.body.email),
  sys_created: new Date(),
});

const registeredUser = await db
.collection("sys_user")
.findOne({ _id: user.insertedId });


let password = String(req.body.pw);

console.log(registeredUser)

  const authManagementClient = new ManagementClient({
    domain: process.env.AUTH_DOMAIN,
    clientId: process.env.AUTH_CLIENT_ID,
    clientSecret: process.env.AUTH_SECRET,
  });

  const userData = {
    email: registeredUser.email,
    password: password,
    connection: "Username-Password-Authentication",
  };

  //Create user in Auth0
  await authManagementClient.users.create(userData);
  res.status(200).send()
};

module.exports = {
  getRegisterPage,
  registerUser,
};
