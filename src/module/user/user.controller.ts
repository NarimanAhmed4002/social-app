import { Router } from "express";
import userService from "./user.service";
import { isAuthenticated } from "../../middleware/auth.middleware";
const router = Router();

router.get("/:id", isAuthenticated(), userService.getProfile);
router.put("/basic-info", isAuthenticated(), userService.updateBasicInfo);
router.post("/update-email", isAuthenticated(), userService.updateEmail);
router.patch("/replace-email", isAuthenticated(), userService.replaceEmail);
router.post("/enable-2fa", isAuthenticated(), userService.enable2FA);
router.post("/verify-2fa", isAuthenticated(), userService.verify2FA);
router.post("/send-request", isAuthenticated(), userService.sendFriendRequest);
router.post(
  "/accept-request",
  isAuthenticated(),
  userService.acceptFriendRequest
);
router.delete(
  "/delete-request",
  isAuthenticated(),
  userService.deleteFriendRequest
);

router.patch("/unfriend", isAuthenticated(), userService.unfriend);

export default router;
