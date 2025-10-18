import { Router } from "express";
import { isAuthenticated } from "../../middleware/auth.middleware";
import PostService from "./post.service";

const router = Router();
router.post("/", isAuthenticated(), PostService.create)
// patch is used to update one field
router.patch("/:id", isAuthenticated(), PostService.addReaction)
export default router;