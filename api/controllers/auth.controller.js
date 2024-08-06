import jwt from 'jsonwebtoken';
import User from '../models/user.model.js'
import bycrptjs from 'bcryptjs';
import { errorHandler } from "../utils/error.js";
export const signup = async (req, res , next) => {
  const { username, email, password } = req.body;

  if (
    !username ||
    !email ||
    !password ||
    username === "" ||
    password === "" ||
    email === ""
  ) {
    next(errorHandler(400 , 'All fields required'));
  }

  const hashedPassword =  bycrptjs.hashSync(password , 10);
   
  const newUser = new User({
    username,
    email,
    password : hashedPassword,
  });
  try {
    await newUser.save();
    res.status(200).json('Signup succesfull');
    
  } catch (error) {
    next(error);
  }
};

export const signin = async(req , res , next ) => {
  const {email , password} = req.body;
  if(!email || !password || email === '' || password === ''){
    return next(errorHandler(400 , 'All fields required'));
  }
  try {
    const validUser = await User.findOne({email});
    if(!validUser){
      return next(errorHandler(404 , 'user not found'));
    }

    const validPassword = bycrptjs.compareSync(password , validUser.password);
    if(!validPassword){
      return next(errorHandler(400 , 'Invalid Password'));
    }
    const { password: pass, ...rest} = validUser._doc;

    const token = jwt.sign(
      {id: validUser._id}, process.env.JWT_SECRET
    );

    res.status(200).cookie('access_token' , token , {
      httpOnly: true
    }).json(rest);
    
  } catch (error) {
    next(error);
  }
}
