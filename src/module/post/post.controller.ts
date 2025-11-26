import { Router } from "express";
import { isAuthenticated } from "../../middleware/auth.middleware";
import PostService from "./post.service";
import { commentRouter } from "..";

const router = Router();
router.use("/:postId/comment", isAuthenticated(), commentRouter); // use NOTT post
router.post("/", isAuthenticated(), PostService.create)
// patch is used to update one field
router.patch("/:id", isAuthenticated(), PostService.addReaction)
router.get("/:id", PostService.getSpecificPost) // public API: anyone can get a specific post by id : login not required
router.delete("/:id", isAuthenticated(), PostService.deletePost)
export default router;

