import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { env } from "../common/utils/envConfig";
import { User } from "../models/User";

// Extend the Request interface to include the user property
declare module "express-serve-static-core" {
  interface Request {
    user?: any;
  }
}
// import { User } from '../models/User';

//auth
export const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    //extract token
    const token =
      req?.cookies?.token ||
      req?.body?.token ||
      req.header("Authorization")?.replace("Bearer ", "");

    //if token missing, then return response
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "TOken is missing",
      });
    }
    console.log(token);

    //verify the token
    try {
      const decode: any = jwt.verify(token, env.JWT_SECRET);
      console.log("decode= ", decode);
      //find user by id
      const user = await User.findById(decode.id);
      if (!user) {
        return res.status(401).json({
          success: false,
          message: "User not found",
        });
      }
      //set user in request object
      req.user = {
        id: user._id,
        email: user.email,
        accountType: user.accountType,
        owner: user.owner,
      };
    } catch (err) {
      //verification - issue
      return res.status(401).json({
        success: false,
        message: "token is invalid",
      });
    }
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      success: false,
      message: "Something went wrong while validating the token",
    });
  }
};

//isInstructor
export const isStaff = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (req.user.accountType !== "Cook" && req.user.accountType !== "Admin") {
      return res.status(401).json({
        success: false,
        message: "This is a protected route for Staff only",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "User role cannot be verified, please try again",
    });
  }
};

//isAdmin
export const isAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (req.user.accountType !== "Admin") {
      return res.status(401).json({
        success: false,
        message: "This is a protected route for Admin only",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "User role cannot be verified, please try again",
    });
  }
};
