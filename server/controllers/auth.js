import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import UserModel from "../models/User.js";

// register
export const register = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      picturePath,
      location,
      occupation,
    } = req.body;
    const salt = await bcrypt.genSalt();
    const passwordEncrypt = await bcrypt.hash(password, salt);
    const newUser = new UserModel({
      firstName,
      lastName,
      email,
      password: passwordEncrypt,
      picturePath,
      location,
      occupation,
    });
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email: email });
    if (!user)
      return res
        .status(400)
        .json({ msg: "Email address does not exist in system." });
    // user does exist, validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res
        .status(400)
        .json({ msg: "Invalid password, please try again. " });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    delete user.password;
    res.status(200).json({ token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
