import { validateRequest } from "@saigon/common";
import { Router } from "express";
import  * as  auth from '../auth/auth'
import { checkAuth } from '../auth/service/checkAuth'
import { validateSignup } from "../auth/service/validate";
const router = Router()

router.post('/signup',validateSignup,validateRequest,auth.signUp)
router.post('/signin',auth.signIn)
router.get('/signout',checkAuth,auth.signOut)
export default router