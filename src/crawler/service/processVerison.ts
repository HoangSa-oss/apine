import KeywordProcess from "../model/versionProcess"


interface processVersionService{
    versionProcessing:any
    keywordStoreLength:any
}
export const processVersionService = async({versionProcessing,keywordStoreLength}:processVersionService)=>{
    const keywordProcessed = await KeywordProcess.findOne({})
    if(keywordStoreLength?.keywordLength===keywordProcessed?.keywordProcessed){
            await KeywordProcess.updateOne({},
                {keywordProcessed:0,keywordVersion:versionProcessing+1}
            )

    }
}