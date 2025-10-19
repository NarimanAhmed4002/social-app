import { Router } from "express";
import { isAuthenticated } from "../../middleware/auth.middleware";
import  CommentService  from "./comment.service";
const router = Router({mergeParams:true});
// endpoint >> /post/:postId/comment/commentId
router.post("{/:id}", isAuthenticated(), CommentService.addComment)
export default router;

// to make params optional in express 5 >> "{/:id}"
// in previous versions >> "/:id?"