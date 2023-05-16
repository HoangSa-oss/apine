import { Router } from "express";
import  * as keywordController from '../controller/keyword.controller'
import { checkAuth } from "../auth/service/checkAuth";
import { validateGetkeyword } from "../controller/service/validate";
import { validateRequest } from "@saigon/common";
const router = Router()

router.post('/keyword',checkAuth,keywordController.postKeyword)
router.get('/getkeyword',checkAuth,validateGetkeyword,validateRequest,keywordController.getKeyword)
router.get('/checkkeyword',checkAuth,keywordController.monitorKeyword)

export default router