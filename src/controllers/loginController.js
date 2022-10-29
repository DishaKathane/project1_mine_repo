const jwt = require("jsonwebtoken");
const authorModel = require("../models/authorModel");
const {isvalidEmail} = require("../vaIidators/validator")


const loginAuthor = async function (req, res) {
  try {
    let userName = req.body.email;
    let password = req.body.password;
    if (Object.keys(req.body).length == 0)
      return res.status(400).send({ status: false, msg: "email and password is required...!" })

    if (!req.body.email)
      return res.status(400).send({ status: false, msg: "email is required...!" })

    if (!isvalidEmail(req.body.email)) {
      return res.status(400).send({ status: false, msg: "Please enter a valid format of email" })
    }

    if (!req.body.password)
      return res.status(400).send({ status: false, msg: "password is required...!" })

    let user = await authorModel.findOne({ email: userName, password: password });
    if (!user)
      return res.status(401).send({ status: false, msg: "username or the password is not corerct...!" });

    let token = jwt.sign(
      {
        authorId: user._id.toString(),
        batch: "Radon",
        organisation: "FunctionUp",
      },
      "Project1_Group10"
    );
    res.setHeader("x-api-key", token);

    return res.status(201).send({ status: true, token: token });

  } catch (err) {
    return res.status(500).send({ status: false, msg: err.message })
  }
};

module.exports.loginAuthor = loginAuthor;