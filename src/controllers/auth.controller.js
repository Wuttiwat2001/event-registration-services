import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import generateToken from "../helpers/generateToken.js";

const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user._id);
    res
      .status(200)
      .json({ success: true, token, message: "User logged in successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const registerUser = async (req, res) => {
  try {
    const { username, password, firstName, lastName, phone } = req.body;

    const existingUser = await User.findOne({
      $or: [{ username }, { phone }],
    });

    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Username or phone already exists" });
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

    res
      .status(201)
      .json({ success: true, token, message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export { loginUser, registerUser };
