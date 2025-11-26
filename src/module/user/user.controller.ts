import { Router } from "express";
import userService from "./user.service";
import { isAuthenticated } from "../../middleware/auth.middleware";
const router = Router();

router.get("/:id", isAuthenticated(), userService.getProfile)
router.put("/basic-info",isAuthenticated(), userService.updateBasicInfo);
export default router;