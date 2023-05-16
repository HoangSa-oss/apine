import mongoose from 'mongoose';
import { any, boolean } from 'webidl-conversions';
const {Schema,model} = mongoose;

interface Keyword {
    idKeywordStore:any
    keyword:string
    version:number
    addQueue:boolean
}

interface KeywordDoc extends mongoose.Document{
    idKeywordStore:mongoose.Types.ObjectId
    keyword:string
    version:number
    addQueue:boolean

}
interface KeywordModel extends mongoose.Model<KeywordDoc>{
    build(KeywordBuild:Keyword):KeywordDoc
}
const schemaKeyword = new Schema<Keyword>({
    idKeywordStore:{type:mongoose.Types.ObjectId,required: true },
    keyword: { type: String, required: true },
    version:{type:Number},
    addQueue:{type:Boolean}

}, { versionKey: false })
schemaKeyword.statics.build = (keyword:Keyword)=>{
    return new Keyword(keyword)
}

const Keyword =  model<KeywordDoc,KeywordModel>('Keyword',schemaKeyword);
export default Keyword