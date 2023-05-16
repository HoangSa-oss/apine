
import  Queue  from 'bull'
import Keyword from '../controller/schema/keyword'
import KeywordStore from '../controller/schema/keywordStore'
const queueKeyWordApi = new Queue('queueKeyWordApiDeloy','redis://127.0.0.1:6379')
import User from '../auth/model/user'

import mongoose from 'mongoose'
const addQueue = async  ()=>{
    await mongoose.connect("mongodb://127.0.0.1:27017/apitiktok", {});

    try {

    const data =  await Keyword.find({addQueue:false}).select("-_id -addQueue").limit(30)

    data.map(async(x:any)=>{
        queueKeyWordApi.add({...x.toObject(),"addQueued":0})
        await Keyword.updateMany(x,{addQueue:true})
    })  
   
    } catch (error) {
        console.log(error)
    }

 
}


addQueue()
