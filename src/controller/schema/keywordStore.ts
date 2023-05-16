import mongoose from 'mongoose';
import { any } from 'webidl-conversions';
const {Schema,model} = mongoose;
import VersionProcess from '../../crawler/model/versionProcess'
interface keywordStore {
    idUser:any
    keyword:[],
    keywordLength:number
    version:number
}
interface keywordStoreBuild {
    idUser:any
    keyword:[],
}
interface keywordStoreDoc extends mongoose.Document{
    idUser:mongoose.Types.ObjectId
    keyword:[]
    keywordLength:number
    version:number
}
interface keywordStoreModel extends mongoose.Model<keywordStoreDoc>{
    build(keywordStoreBuild:keywordStoreBuild):keywordStoreDoc
}
const schemaKeywordStore = new Schema<keywordStore>({
    idUser:{type:mongoose.Types.ObjectId,required: true },
    keyword: { type: [], required: true },
    keywordLength:{type:Number},
    version:{type:Number}
}, { versionKey: false })
schemaKeywordStore.statics.build = (keywordStore:keywordStore)=>{
    return new KeywordStore(keywordStore)
}
schemaKeywordStore.pre('save',async function (done) {
    let keywordArray = this.keyword
    let keywordLength = keywordArray.length
    let lastRecord = await KeywordStore.find({}).sort({_id:-1}).limit(1)
    if(lastRecord.length==0){
        this.set('version',0)
        this.set('keywordLength',keywordLength)
        
    }else{
        this.set('version',lastRecord[0].version+1)
        this.set('keywordLength',keywordLength)
    }
    done()
})
const KeywordStore =  model<keywordStoreDoc,keywordStoreModel>('keywordStore',schemaKeywordStore);
export default KeywordStore