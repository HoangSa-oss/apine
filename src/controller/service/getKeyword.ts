import UrlPost from "../../crawler/model/urlPost"
import moment from 'moment'
interface getKeyword{
    idKeywordStore:string
    date:Date
    skip:number
    limit:number
}

export const getKeywordService = async ({idKeywordStore,date,skip,limit}:getKeyword) => {
    const dateCovert = moment(date).format('X')
    // console.log(dateCovert)
    const urlPost = UrlPost.find({idKeywordStore:idKeywordStore}).gte('date',dateCovert).limit(limit).skip(skip)
    return urlPost
}