const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true, collection: "users" }
);

// Static method to register a new user
userSchema.statics.register = async function (name, email, password) {
    // Validate email format
    if (!validator.isEmail(email)) {
      throw new Error("Please enter a valid email address");
    }

    // Validate password is string
    if (typeof password !== 'string') {
      throw new Error("Password must be a string");
    }

    // Check password strength
    if (!validator.isStrongPassword(password, {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1
    })) {
      throw new Error("Password is not strong enough");
    }

    const existingUser = await this.findOne({ email });
    if (existingUser) {
      throw new Error("User already exists with this email");
    }
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
  
    const user = await this.create({ name, email, password: hashedPassword });
    return user;
};

// Static method to login a user
userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email });
  if (!user) {
    throw new Error("User not found");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Incorrect password");
  }

  return user;
};

// Static method to get all users (excluding passwords)
userSchema.statics.getAllUser = async function (email) {
    const users = await this.find({email: email}, { password: 0 }); // Exclude password
    return users;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
