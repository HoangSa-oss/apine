import puppeteer from 'puppeteer-extra';
import domtiktokkey from './dom/domtiktokkey.json'
import Queue from 'bull';
import cookie from './cookiedefault.json'  
const queueKeyWordApi = new Queue('queueKeyWordApiDeloy','redis://127.0.0.1:6379')
import fs from 'fs/promises'
import delay from 'delay';
import StealthPlugin from 'puppeteer-extra-plugin-stealth'
import  {executablePath, HTTPRequest} from 'puppeteer'
puppeteer.use(StealthPlugin());
interface keywordFunction {
    indexCookie:number
    job:any
    browser:any
    ordinalCookie:number
    
}
export default async function workkeyFunction ({indexCookie,job,browser,ordinalCookie}:keywordFunction){
    let cookiee:any[] = cookie as any
    let cookieArray = cookiee[indexCookie]
    const page = await browser.newPage()
    await page.setCookie(...cookieArray[ordinalCookie])
    await page.setDefaultTimeout(30000)
    page.setViewport({width: 1440, height: 900});
    var domTiktok:any
    let arrayData = [] ;
    try {
        // page.on('request', async (request) => {
        //     let a =  await request.url()
        //     console.log(a)
        // })
        await page.goto('https://www.tiktok.com')
        domTiktok = domtiktokkey.english
        await page.waitForSelector('a > span > svg')
        await page.focus(domTiktok.elementSearchBar)
        await page.keyboard.type(job.data.keyword.trim(),{delay: 100})
        await delay(1000)
        await page.keyboard.press('Enter')
        const request = await page.waitForRequest((request:HTTPRequest)=>{
            if(request.url().includes('https://www.tiktok.com/api/search/general/full/')){
                return request
            }
        })
        const requestUrl = request.url()
        const indexOfOffset = requestUrl.indexOf('offset')
        const requestFirst = requestUrl.slice(0,indexOfOffset+7)
        const requestEnd = requestUrl.slice(indexOfOffset+8,requestUrl.length+100)
        for(let i=0;i<100;i++){
            let requestFinal =`${requestFirst}${i*12}${requestEnd}` 
            await page.goto(requestFinal, { waitUntil: "networkidle0" })
            const text = await page.$eval("body > pre", (el:any) => el.textContent);
            const jsonText = JSON.parse(text)
            if (jsonText.status_code == 0||jsonText.status_code==2484) break;
            const resData = jsonText.data
                .filter((item:any) => item.type == 1)
                .map((item:any) => {
                return {
                    date: item.item.createTime,
                    urlPost: `https://www.tiktok.com/@${item.item.author.uniqueId}/video/${item.item.id}`,
                };
            });
            arrayData.push(...resData)
            // resData.map(async (x)=>{
            //     x.date = moment.unix(x.date).format()
            //     if(x.date>=dateTimeStamp){
            //         const insert = new schemaurlpost({keyword:job.data.keyword,...x})
            //         await insert.save()
            //     }
            // })
            
        }
    
    } catch (error:any) {   
        console.log(error) 
    }
    // if(arrayData.length>200){
    //     arrayData.map(async(x)=>{
    //         const insert = new schemaurlpost({keyword:job.data.keyword,...x})
    //         await insert.save()
    //     })
    // }else{
    //     ordinalCookie++
    // }
    
    try {
        await page.close()
    } catch (error) {
        console.log(error)
    }    
    // console.log(arrayData.length)
    return arrayData
 
   
}
