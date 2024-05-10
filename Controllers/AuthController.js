const AuthModel = require("../Models/AuthModel");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//check for duplicate emails
async function FoundUser(email) {
  return await AuthModel.findOne({ email: email }).exec();
}

let register = async (req, res) => {
  var body = req.body.data;

  let foundUser = await FoundUser(body.email);
  if (foundUser) return res.status(404).send({ message: false });

  var salt = await bcrypt.genSalt(10);
  var hashedPassword = await bcrypt.hash(body.password, salt);

  body.email = body.email.toLowerCase();
  body.password = hashedPassword;

  var newUser = new AuthModel(body);
  await newUser
    .save()
    .then()
    .catch((err) => {
      res.json({ message: err });
    });
  res.status(201).send({ message: true });
};
let login = async (req, res) => {
  var body = req.body.data;
  console.log(body, "vvvvvv");
  if (!body.gmail) {
    body.email = body.email.toLowerCase();
    let foundUser = await FoundUser(body.email);
    if (!foundUser) return res.status(200).send({ message: false });

    var passwordValid = await bcrypt.compare(body.password, foundUser.password);

    if (!passwordValid) return res.status(200).send({ message: false });

    var token = jwt.sign(
      { id: foundUser._id, email: foundUser.email, isAdmin: foundUser.isAdmin },
      "secret"
    );

    res.header("x-auth-token", token);
    res.status(200).send({ token: token, message: true });
  } else {
    body.email = body.email.toLowerCase();
    let foundUser = await FoundUser(body.email);
    if (!foundUser) return res.status(200).send({ message: false });
    var token = jwt.sign(
      {
        id: foundUser._id,
        email: foundUser.email,
        isAdmin: foundUser.isAdmin,
      },
      "secret"
    );
    res.header("x-auth-token", token);
    res.status(200).send({ token: token, message: true });
  }
};

let decodeToken = async (req, res) => {
  let token = req.header("Authorization");
  if (token) {
    let userID = jwt.verify(token, "secret").id;
    return userID;
  }
  return false;
};

module.exports = { register, login, decodeToken };
