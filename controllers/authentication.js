let jwt = require("jsonwebtoken");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
config = require("../config/auth");

exports.login = async (req, res, next) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const user = await User.findOne({ email});
    const id = user._id;
    var passwordIsValid = bcrypt.compare(password, user.password);

    if (!user) {
      return res.status(404).send({ message: "User not registered!" });
    }

    if (!passwordIsValid) {
      return res.status(401).send({ message: "Password is invalid" });
    }

    let userData = {email, password, id};

    let token = jwt.sign(userData, config.secretKey, {
      algorithm: "HS256",
      expiresIn: "365d",
    });

    return res.status(200).json({
      message: "Login successful",
      jwtoken: token,
      user: user
    });
  } catch (error) {
    next(error);
  }
};
