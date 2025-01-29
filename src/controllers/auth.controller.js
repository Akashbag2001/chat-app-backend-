import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcrypt";

export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;

  try {
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required!" });
    }
    if (password < 6) {
      return res
        .status(400)
        .json({ message: "Password must be atleast 6 characters" });
    }
    const user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "Email already exists!" });
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName: fullName,
      email,
      password: hashedPassword,
    });
    if (newUser) {
      generateToken(newUser._id, res);
      await newUser.save();

      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
      });
    } else {
      res.status(400).json({ message: "Invalid user data!" });
    }
  } catch (error) {
    console.log("Error in signup controller", error.message);
    res.status(500).json({ message: "Internal Server Error!!" });
  }
};

export const login = async (req, res) => {
  const {email, password} = req.body;
  try {
    const user = await User.findOne({email})

    if(!user){
      return res.status(400).json({message: "Invalid Credential!"})
    }
    const isCorrectPassword = bcrypt.compare(password, user.password)
    if(!isCorrectPassword){
      return res.status(400).json({message: "Invalid Credential!"})
    }

    generateToken(user._id,res);

     res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic
    })
  } catch (error) {
    console.log("Error in login Controller",error.message)
    res.status(500).json({message: "Internal Server Error!!" })
  }
};

export const logout = (req, res) => {
  try {
    res.cookie("jwt","",{maxAge:0})
    res.status(200).json({message: "Logged Out Successfully!"})
  } catch (error) {
    console.log("Error in logout controller", error.message)
    res.status(500).json({message: "Internal Server Error!!" })
  }
};

export const updateProfile = async()=>{
  try {
    const {profilePic} = req.body;
    const userId = req.body._id;

    if(!profilePic){
      return res.status(400).json({message: "Profile picture is required!"})
    }
    const uploadResponse = await cloudinary.uploader.upload(profilePic)
    const updatedUser = await User.findByIdAndUpdate(userId,{profilePic:uploadResponse.secure_url},{new:true})
  } catch (error) {
    
  }
}
