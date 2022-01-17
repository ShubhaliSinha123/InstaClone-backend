require("../db/conn");
const bcrypt = require('bcryptjs');
const User = require("../models/user");

exports.createUser = async (req, res, next) => {
  try {
    const { name, email, phone, password, cpassword, role } = req.body;

    if(!name || !email || !phone || !password || !cpassword || !role) {
      return res.status(403).json({alert: "Please fill all the fields properly!"});
    }

    if(password === cpassword) {
      const userExist = await User.findOne({ email });
  
      if (userExist) {
        return res.status(403).json({ error: "User has already registered!" });
      }
  
      await User.create({
        name,
        email,
        phone,
        password: bcrypt.hashSync(req.body.password, 8),
        cpassword: bcrypt.hashSync(req.body.cpassword, 8),
        role
      });
    } else {
      return res.status(402).json({error: "Password didn't match! Enter the correct password!"});
    }

    return res.status(201).json({ message: "User registered sucessfully!" });
  } catch (error) {
    next(error);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const { name, email, phone, password, cpassword, role } = req.body;

    const userExist = await User.findOne({ email });

    if (!userExist) {
      return res.status(404).json({ error: "User doesn't exist" });
    }

    await userExist.update({
      name,
      email,
      phone,
      password,
      cpassword,
      role
    });

    return res.status(201).json({ message: "User updated successfully!" });
  } catch (error) {
    next(error);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const id = req.params.userId;

    const userExist = await User.findById({ _id: id });

    if (!userExist) {
      return res.status(404).json({ error: "User doesn't exist" });
    }

    await userExist.delete();

    return res.status(200).json({ message: "User deleted successfully!" });
  } catch (error) {
    next(error);
  }
};

exports.findAndCountUser = async (req, res, next) => {
  try {
    const query = {
      attributes: ["name", "email", "phone", "password"],
    };

    const data = await User.find(query);

    return res.status(200).send(data);
  } catch (error) {
    next(error);
  }
};

exports.logoutUser = async (req, res, next) => {
  try {
    const userId = await req.loggedInUser.id;

    const user = await User.findById({_id: userId});

    if(!user) {
      return res.status(404).send("User doesn't exist anymore!");
    }
    return res.status(200).send("User logout successfully..");
  } catch (error) {
    next(error);
  }
};