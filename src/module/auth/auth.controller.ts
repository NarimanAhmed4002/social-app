import { Router } from "express";
import authService from "./auth.service";
import * as authValidation from "./auth.validation"
import { isValid } from "../../middleware";
const router = Router();
router.post(
    "/register",
    isValid(authValidation.registerSchema), 
    authService.register
    );

router.post("/verify-account", authService.verifyAccount)
router.post("/login", authService.login)
export default router;



// Handles HTTP requests (login, signup, logout).