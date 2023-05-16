import mongoose, { model, Schema } from "mongoose"
import VersionProcess from './versionProcess'
import KeywordStore from "../../controller/schema/keywordStore"
interface urlPost{
    idKeywordStore:any
    keyword:string
    urlPost:string
    date:number
}
interface urlPostDoc extends mongoose.Document{
    idKeywordStore:mongoose.Types.ObjectId
    keyword:string
    urlPost:string
    date:number
}
interface urlPostModel extends mongoose.Model<urlPostDoc>{
    build(urlPost:urlPost):urlPostDoc
}
const schemaUrlPost = new Schema<urlPost>({
    idKeywordStore:{type:mongoose.Types.ObjectId,required:true},
    keyword:{type:String,required:true},
    urlPost:{type:String,required:true},
    date:{type:Number,required:true}
},
{
    toJSON:{
        transform(doc,ret){
            ret.id=ret._id
            delete ret._id
        }
}}
)
schemaUrlPost.statics.build = (urlPost:urlPost)=>{
    return new UrlPost(urlPost)
}

const UrlPost = model<urlPostDoc,urlPostModel>('UrlPost',schemaUrlPost)
export default UrlPost