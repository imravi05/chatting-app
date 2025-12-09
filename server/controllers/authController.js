// server/controllers/authController.js
const User = require("../models/User");
const bcrypt = require("bcrypt");

// 1. REGISTER
module.exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    
    // Check if user exists
    const usernameCheck = await User.findOne({ username });
    if (usernameCheck)
      return res.json({ msg: "Username already used", status: false });
    
    const emailCheck = await User.findOne({ email });
    if (emailCheck)
      return res.json({ msg: "Email already used", status: false });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = await User.create({
      email,
      username,
      password: hashedPassword,
    });
    
    // Return user without password
    const userResponse = user.toObject();
    delete userResponse.password;
    
    return res.json({ status: true, user: userResponse });
  } catch (ex) {
    next(ex);
  }
};

// 2. LOGIN
module.exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    
    const user = await User.findOne({ username });
    if (!user)
      return res.json({ msg: "Incorrect Username or Password", status: false });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.json({ msg: "Incorrect Username or Password", status: false });

    const userResponse = user.toObject();
    delete userResponse.password;

    return res.json({ status: true, user: userResponse });
  } catch (ex) {
    next(ex);
  }
};

// 3. GET ALL USERS (To populate the sidebar)
module.exports.getAllUsers = async (req, res, next) => {
  try {
    // Fetch all users except the one requesting (passed as param id)
    const users = await User.find({ _id: { $ne: req.params.id } }).select([
      "email",
      "username",
      "avatarImage",
      "_id",
    ]);
    return res.json(users);
  } catch (ex) {
    next(ex);
  }
};