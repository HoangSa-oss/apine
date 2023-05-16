import mongoose from 'mongoose';
import { any, boolean } from 'webidl-conversions';
const {Schema,model} = mongoose;

interface keywordError {
    idKeywordStore:any
    keyword:string
    version:number
    error:string
}

interface keywordDoc extends mongoose.Document{
    idKeywordStore:mongoose.Types.ObjectId
    keyword:string
    version:number
    error:string

}
interface keywordModel extends mongoose.Model<keywordDoc>{
    build(KeywordBuild:keywordError):keywordDoc
}
const schemaKeywordError = new Schema<keywordError>({
    idKeywordStore:{type:mongoose.Types.ObjectId,required: true },
    keyword: { type: String, required: true },
    version:{type:Number},
    error:String
}, { versionKey: false })
schemaKeywordError.statics.build = (keywordError:keywordError)=>{
    return new KeywordError(keywordError)
}

const KeywordError =  model<keywordDoc,keywordModel>('KeywordError',schemaKeywordError);
export default KeywordError