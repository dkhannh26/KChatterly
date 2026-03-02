import User from "../models/User.js";
import jwt from "jsonwebtoken";
import { upsertStreamUser } from "../lib/stream.js";

export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;

  try {
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use." });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long." });
    }

    const idx = Math.floor(Math.random() * 100) + 1;
    const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;

    const newUser = new User({
      fullName,
      email,
      password,
      profilePic: randomAvatar,
    });

    await newUser.save();

    try {
      await upsertStreamUser({
        id: newUser._id.toString(),
        fullName: newUser.fullName,
        profilePic: newUser.profilePic,
      });
      console.log(`Stream user created successfully for ${newUser.fullName}`);
    } catch (error) {
      console.error("Error creating Stream user: ", error);
    }

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true, // prevent client-side JS from accessing the cookie
      secure: process.env.NODE_ENV === "production", // set to true in production
      sameSite: "Strict", // adjust based on your requirements
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      message: "User registered successfully.",
      user: newUser,
      token,
    });
  } catch (error) {
    console.log("Signup error:", error);
    return res.status(500).json({ message: "Server error." });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    const isPasswordCorrect = await user.matchPassword(password);

    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true, // prevent client-side JS from accessing the cookie
      secure: false, // process.env.NODE_ENV === "production", // set to true in production
      sameSite: "Strict", // adjust based on your requirements
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Login successful.",
      user,
      token,
    });
  } catch (error) {
    console.log("Login error:", error);
    return res.status(500).json({ message: "Server error." });
  }
};

export const logout = (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logout successful." });
};

export const onboard = async (req, res) => {
  try {
    const userId = req.user._id;

    const { fullName, bio, nativeLanguage, learningLanguage, location } =
      req.body;

    if (
      !fullName ||
      !bio ||
      !nativeLanguage ||
      !learningLanguage ||
      !location
    ) {
      return res.status(400).json({
        message: "All fields are required.",
        missingFields: [
          !fullName && "fullName",
          !bio && "bio",
          !nativeLanguage && "nativeLanguage",
          !learningLanguage && "learningLanguage",
          !location && "location",
        ].filter(Boolean), //filter out undefined values
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { ...req.body, isOnboarded: true },
      { new: true },
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found." });
    }

    try {
      await upsertStreamUser({
        id: updatedUser._id.toString(),
        fullName: updatedUser.fullName,
        profilePic: updatedUser.profilePic,
      });
    } catch (error) {
      console.error("Error upserting Stream user during onboarding:", error);
    }

    return res.status(200).json({
      message: "Onboarding completed successfully.",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Onboarding error:", error);
    return res.status(500).json({ message: "Server error." });
  }
};
