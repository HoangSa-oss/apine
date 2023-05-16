import jwt from "jsonwebtoken";
import express, {Router, Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import {BadRequestError, validateRequest,NotAuthorizedError} from '@saigon/common'
import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config()
const router = Router()
interface UserPayload{
    id:string,
    email:string
}
declare global {
    namespace Express {
      interface Request {
        currentUser?: UserPayload;
      }
    }
}
export const currentUser = async(req:Request,res:Response,next:NextFunction)=>{
    if(!req.session?.jwt){
       return next()
    }
    try{
        const payload = jwt.verify(
            req.session?.jwt,
            process.env.JWT_KEY!
        ) as UserPayload
        req.currentUser = payload
    }catch{
    }
    next()
}
export const checkAuth = async(req:Request,res:Response,next:NextFunction)=>{
   if(!req.currentUser){
    throw new NotAuthorizedError()
   }
   next()
}

