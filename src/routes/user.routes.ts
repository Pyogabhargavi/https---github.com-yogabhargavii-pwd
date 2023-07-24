import express, { Router, Request, Response, NextFunction} from 'express'
import { UserModel, IUser } from '../modals/user.modals'
import jwt from 'jsonwebtoken'
import Logger from "../loggers";
import { StatusCodes } from 'http-status-codes';
import bcrypt from "bcrypt";

const router = Router()

router.post("/register", async(req: Request,res: Response) => {
try{
    const userDetails = req.body;
    if(!userDetails){
        res.status(StatusCodes.BAD_REQUEST).send({status: StatusCodes.BAD_REQUEST, message: "Fill all the details"}).end()
        Logger.info("user not filled complete details", userDetails)
    }
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(userDetails.password, saltRounds);
    const userData = new UserModel({
        email: userDetails.email,
        password: hashedPassword
    })
    // const userData = new UserModel(userDetails)
    await userData.save();
    res.status(StatusCodes.OK).send({status: StatusCodes.OK, message: "Registered successfully"});
    Logger.info("Registered successfully", userData)
}catch(err){
    if(err){
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({status: StatusCodes.INTERNAL_SERVER_ERROR, message: "Server Error"})
    }
}
})

router.post("/login", async(req:Request, res: Response) => {
    try{
        const userDetails = req.body;
        console.log("userDetails: ", userDetails);
        if(!userDetails){
            res.status(StatusCodes.BAD_REQUEST).send({status: StatusCodes.BAD_REQUEST, message: "Please enter all the fileds"}).end()
        }
        const registeredUser:IUser | null = await UserModel.findOne({email: userDetails.email});
        console.log("registeredUser: ", registeredUser);
        if(!registeredUser){
            res.status(StatusCodes.BAD_REQUEST).send({status: StatusCodes.BAD_REQUEST, message: "User is not registered"});
            return;
        }
        const validPassword =  await bcrypt.compare(userDetails.password, registeredUser.password)
        if(!validPassword){
            res.status(StatusCodes.BAD_REQUEST).send({status: StatusCodes.BAD_REQUEST, message: "Password is invalid"})
        }
        const token = jwt.sign({ id: userDetails.id}, 'chiNNY')
        res.status(StatusCodes.OK).send({
            status: StatusCodes.OK ,
            token: token,
            email: userDetails.email,
            message: "Login successfully"
        })
    }catch(err){
        if(err){
            throw new Error("Error in Login")
        }
    }
})

router.delete("/delete", async(req: Request, res: Response) => {
    try{
        const userDetails = req.body.email;
        if(!userDetails){
            res.status(StatusCodes.BAD_REQUEST).send({status: StatusCodes.BAD_REQUEST, message: "Please enter your details"})
        }
        const validUser: IUser | null = await UserModel.findOneAndDelete({email: req.body.email});
        if(!validUser){
            res.status(StatusCodes.BAD_REQUEST).send({status: StatusCodes.BAD_REQUEST, message: "User Not Found"})
        }
        res.status(StatusCodes.OK).send({status: StatusCodes.OK, message: "User deleted successfully"})
    }catch (err){
        if(err){
            throw new Error("Error in deleting user profile");
        }
    }
})

router.put("/edit", async (req: Request, res: Response) => {
    try {
      const userDetails: IUser = req.body;
      console.log("userDetails: ", userDetails);
      
      if (!userDetails) {
        return res.status(StatusCodes.BAD_REQUEST).send({ status: StatusCodes.BAD_REQUEST, message: "Please enter all the fields" });
      }
      
      const registeredUser: IUser | null = await UserModel.findOneAndUpdate({ email: userDetails.email }, {password: userDetails.password}, {new: true});
      if (!registeredUser) {
        return res.status(StatusCodes.BAD_REQUEST).send({ status: StatusCodes.BAD_REQUEST, message: "User is not registered" });
      }
      
      return res.status(StatusCodes.OK).send({ status: StatusCodes.OK, message: "Password updated successfully", registeredUser });
    } catch (err) {
      console.error(err);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ status: StatusCodes.INTERNAL_SERVER_ERROR, message: "Error in updating details" });
    }
  });

export default router