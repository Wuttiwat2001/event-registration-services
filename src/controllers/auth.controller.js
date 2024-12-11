import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import generateToken from "../helpers/generateToken.js";
import HttpError from "../utils/HttpError.js";

const loginUser = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (!user) {
      return next(new HttpError(400, "Username or Password is incorrect"));
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return next(new HttpError(400, "Username or Password is incorrect"));
    }

    const token = generateToken(user._id);
    res
      .status(200)
      .json({ success: true, token, message: "User logged in successfully" });
  } catch (error) {
    next(error);
  }
};

const registerUser = async (req, res, next) => {
  try {
    const { username, password, firstName, lastName, phone } = req.body;

    const existingUser = await User.findOne({
      $or: [{ username }, { phone }],
    });

    if (existingUser) {
      if (existingUser.username === username) {
        throw new HttpError(400, "Username already exists");
      }
      if (existingUser.phone === phone) {
        throw new HttpError(400, "Phone number already exists");
      }
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      password: passwordHash,
      firstName,
      lastName,
      phone,
    });

    const user = await newUser.save();
    const token = generateToken(user._id);

    res.status(201).json({ success: true, token, message: "User registered successfully" });
  } catch (error) {
    next(error); // ส่งข้อผิดพลาดไปยัง error handler
  }
};

export { loginUser, registerUser };
