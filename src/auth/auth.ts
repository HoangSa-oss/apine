import jwt from "jsonwebtoken";
import User from "./model/user";
import express, {Router, Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import {BadRequestError, NotAuthorizedError, validateRequest} from '@saigon/common'
import { Password } from "./service/password";
import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config()

export const signUp = async(req:Request,res:Response)=>{
    const {email,password} = req.body
    const exitsUser =  await User.findOne({email})
    if(exitsUser){
        throw new BadRequestError('Email is use')
    }
    const user = User.build({
        email,
        password
    })
    await user.save()
    res.status(201).send(user)
}
export const signIn = async(req:Request,res:Response)=>{
    const {email,password} = req.body
    const exitsUser =  await User.findOne({email})
    if(!exitsUser){
     throw new BadRequestError('Email is not found')
    }

    const passwordMatch = await Password.comparePassword(exitsUser.password,password)
    if(!passwordMatch){
        throw new BadRequestError('Password was wrong')
    }
    const jwtUser = jwt.sign({
        id:exitsUser.id,
        email:exitsUser.email
    },process.env.JWT_KEY!)
    req.session = {
        jwt:jwtUser
    }
    res.status(201).send(exitsUser)
}
export const signOut = async(req:Request,res:Response)=>{
    req.session = null
    res.send({})
}
