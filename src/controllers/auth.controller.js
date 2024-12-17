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

    if (!user.roles.includes("USER")) {
      return next(new HttpError(403, "Access denied. Users only."));
    }

    const token = generateToken(user._id);
    res.status(200).json({
      success: true,
      token,
      data: {
        id: user._id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        roles: user.roles,
      },
      message: "User logged in successfully",
    });
  } catch (error) {
    next(error);
  }
};

const loginAdmin = async (req, res, next) => {
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

    if (!user.roles.includes("ADMIN")) {
      return next(new HttpError(403, "Access denied. Admins only."));
    }

    const token = generateToken(user._id);
    res.status(200).json({
      success: true,
      token,
      data: {
        id: user._id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        roles: user.roles,
      },
      message: "User logged in successfully",
    });
  } catch (error) {
    next(error);
  }
};

const registerUser = async (req, res, next) => {
  try {
    const { username, password, firstName, lastName, phone, roles } = req.body;

    const existingUser = await User.findOne({
      $or: [{ username }, { phone }],
    });

    if (existingUser) {
      if (existingUser.username === username) {
        return next(new HttpError(400, "Username already exists"));
      }
      if (existingUser.phone === phone) {
        return next(new HttpError(400, "Phone number already exists"));
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
      roles: roles || ["USER"],
    });

    const user = await newUser.save();
    const token = generateToken(user._id);

    res
      .status(201)
      .json({ success: true, token, message: "User registered successfully" });
  } catch (error) {
    next(error);
  }
};

export { loginUser, loginAdmin, registerUser };
