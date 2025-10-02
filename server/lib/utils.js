import jwt from 'jsonwebtoken';

export const generateToken = (userID) => {
  const token = jwt.sign({userID},process.env.JWT_SECRET_KEY,{expiresIn:"7d"})
  return token;
}