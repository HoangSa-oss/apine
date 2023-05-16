import { body, validationResult } from 'express-validator';
import { isValidObjectId } from 'mongoose';
export const validateGetkeyword  =  [
    body('idKeywordStore')
      .custom(value=>{
        if(!isValidObjectId(value)){
          throw new Error('idKeywordStore error')
        }
      })
    ,
    body('date')
      .trim()
      .isDate()
      .withMessage('syntax yyyy/mm/dd')
]