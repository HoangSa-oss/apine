import mongoose, { model, Schema } from "mongoose"
import KeywordStore from "../../controller/schema/keywordStore"
interface versionProcess {
    keywordVersion:number
    keywordProcessed:number
}
interface versionProcessDoc extends mongoose.Document{
    keywordVersion:number
    keywordProcessed:number
}
interface versionProcessModel extends mongoose.Model<versionProcessDoc>{
    build(versionProcess:versionProcess):versionProcessDoc
}
const schemaKeywordProcess = new Schema({
    keywordVersion:Number,
    keywordProcessed:Number
},
{
    toJSON:{
        transform(doc,ret){
            ret.id=ret._id
            delete ret._id
        }
    }}
)
schemaKeywordProcess.statics.build = (versionProcess:versionProcess)=>{
    return new KeywordProcess(versionProcess)
}
// schemaKeywordProcess.post('updateOne',async function(res,next){
//     const versionProcessing = await KeywordProcess.findOne({})
//     const keywordStoreLength = await KeywordStore.findOne({version:versionProcessing?.keywordVersion})
// console.log('keywordStoreLength',keywordStoreLength?.keywordLength)
// console.log('versionProcessing',versionProcessing?.keywordProcessed)
//     if(keywordStoreLength?.keywordLength===versionProcessing?.keywordProcessed){
//         console.log(versionProcessing)
//             await KeywordProcess.updateOne({},
//                 {keywordProcessed:0,keywordVersion:versionProcessing?.keywordVersion!+1}
//             )

//     }
// })
const KeywordProcess = model<versionProcessDoc,versionProcessModel>('versionProcess',schemaKeywordProcess)
export default KeywordProcess