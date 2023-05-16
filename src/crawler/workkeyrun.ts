
import { tiktokProfile } from "./workkeya"
import moment from "moment"
import mongoose from "mongoose";
import KeywordProcess from "./model/versionProcess";
const run = async()=>{
    await mongoose.connect("mongodb://127.0.0.1:27017/apitiktok", {});
    var versionProcessing = await KeywordProcess.findOne({})
    if(!versionProcessing){
        const insert = KeywordProcess.build({
            keywordProcessed:0,
            keywordVersion:0
        })
        await insert.save()
        versionProcessing = await KeywordProcess.findOne({})
    }
    for(let i=0;i<1;i++){
        await tiktokProfile(i)
    }
}
run()
