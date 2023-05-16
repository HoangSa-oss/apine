import {Request,Response} from 'express'
import crypto from 'crypto'
import User from '../auth/model/user'
import KeywordStore from './schema/keywordStore'
import Keyword from './schema/keyword'
import { getKeywordService } from './service/getKeyword'
import { monitorService } from './service/monitorKeyword'
import { isValidObjectId } from 'mongoose'
import { BadRequestError } from '@saigon/common'
export const postKeyword = async (req:Request,res:Response)=>{
    let keyword = req.body.data
    let idUser = req.currentUser?.id
    console.log(idUser)
    if(typeof keyword == 'object'){
        const keywordStore =  KeywordStore.build({
            keyword:keyword,
            idUser:idUser,  
        })
        
        await keywordStore.save()
        keyword.map(async(x:any)=>{
            let keyword = Keyword.build({
                idKeywordStore:keywordStore._id,
                keyword:x,
                version:keywordStore.version,
                addQueue:false
            })
            keyword.save()
        })
        res.status(200).send(keywordStore._id)
    }else{
        res.status(400).send("syntax is {'data':['keyword1','keyword2',.....]}")
    }  
}
export const getKeyword  = async (req:Request,res:Response)=>{
    const {idKeywordStore,date,limit,skip}= req.body
    console.log(req.body)
    console.log(idKeywordStore)
    const keywordStore = await  KeywordStore.findOne({_id:idKeywordStore})
    console.log(keywordStore)
    if(!keywordStore){
        throw new BadRequestError('Not id found')
    }
    const urlPost = await getKeywordService({idKeywordStore,date,limit,skip})
    res.status(200).send(urlPost)
}
export const monitorKeyword = async (req:Request,res:Response)=>{
    const {idKeywordStore}=req.body
    
    if(!isValidObjectId(idKeywordStore)){
        throw new BadRequestError('check Id')
    }
    const a = await monitorService({idKeywordStore})
    res.status(200).send(a)

}
