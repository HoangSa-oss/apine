import keywordFuntion from './workkey'
import puppeteer from 'puppeteer-extra';
import Queue from 'bull';
import delay from 'delay';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import  {executablePath} from 'puppeteer'
import fs from 'fs/promises'
import UrlPost from './model/urlPost';
import KeywordProcess from './model/versionProcess';
import KeywordStore from '../controller/schema/keywordStore';
import KeywordError from '../controller/schema/keywordError';
import { processVersionService } from './service/processVerison';

export const  tiktokProfile = async(indexCookie:number)=>{
    const queueKeyWordApi = new Queue('queueKeyWordApiDeloy','redis://127.0.0.1:6379')
    const browser = await puppeteer.launch({
        headless: true,
      ignoreHTTPSErrors: true,
      executablePath:executablePath(),
       args: ['--disable-setuid-sandbox', '--no-sandbox'],
    
    }); 
    let ordinalCookie = 0
    let sumQueued = 4
    queueKeyWordApi.process(async(job,done)=>{
        let keywordProcessing = await KeywordProcess.findOne({}).select('keywordVersion')
        let versionProcessing = keywordProcessing?.keywordVersion
        const keywordStoreLength = await KeywordStore.findOne({version:versionProcessing})
        if(job.data.version!=versionProcessing){
            queueKeyWordApi.add(job.data)
            done()
            return 
        }
        console.log("versionjobdata",job.data.version)
        let arrayData = await keywordFuntion({ordinalCookie:ordinalCookie,browser:browser,job:job,indexCookie:indexCookie})
        console.log(arrayData.length)
        if(arrayData.length>200){
            arrayData.map(async(x)=>{
                    const insert =UrlPost.build({...job.data,...x})
                    await insert.save()
            })
            await KeywordProcess.updateOne({},{
                $inc:{keywordProcessed:1}
            })
            await processVersionService({versionProcessing,keywordStoreLength})
        }else{
            if(job.data.addQueued<sumQueued){
            
                queueKeyWordApi.add({...job.data,addQueued:job.data.addQueued+1})
           
                ordinalCookie++
            }else{
                let insert = KeywordError.build({
                    ...job.data
                })
                await insert.save()
                await KeywordProcess.updateOne({},{
                    $inc:{keywordProcessed:1}
                })
                await processVersionService({versionProcessing,keywordStoreLength})

            }
        }

        done()
    })

}
