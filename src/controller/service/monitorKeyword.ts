import UrlPost from "../../crawler/model/urlPost"
import moment from 'moment'
import KeywordStore from "../schema/keywordStore"
import KeywordProcess from "../../crawler/model/versionProcess"
interface monitorKeyword{
    idKeywordStore:string
}

export const monitorService = async ({idKeywordStore}:monitorKeyword) => {
    const keywordStore = await  KeywordStore.findOne({_id:idKeywordStore})
    if(!keywordStore){
        return 'not found id'
    }
    const versionprocessing = await KeywordProcess.findOne({})
    switch(true){
        case keywordStore!.version > versionprocessing!.keywordVersion:
            return {
                keywordProcessed:0,
                KeywordStore:keywordStore?.keywordLength
            }
        case keywordStore!.version < versionprocessing!.keywordVersion: 
            return {
                keywordProcessed:keywordStore?.keywordLength,
                KeywordStore:keywordStore?.keywordLength
            }
        case keywordStore!.version == versionprocessing!.keywordVersion: 
            return {
                keywordProcessed:versionprocessing?.keywordProcessed,
                KeywordStore:keywordStore.keywordLength
            }
    }
}