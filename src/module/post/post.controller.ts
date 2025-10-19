import { Router } from "express";
import { isAuthenticated } from "../../middleware/auth.middleware";
import PostService from "./post.service";

const router = Router();
router.post("/", isAuthenticated(), PostService.create)
// patch is used to update one field
router.patch("/:id", isAuthenticated(), PostService.addReaction)
router.get("/:id", PostService.getSpecificPost) // public API: anyone can get a specific post by id : login not required
export default router;

// validations 
// auth-middleware