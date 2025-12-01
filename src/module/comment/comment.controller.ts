import { Router } from "express";
import { isAuthenticated } from "../../middleware/auth.middleware";
import  CommentService  from "./comment.service";
const router = Router({mergeParams:true});
// endpoint >> /post/:postId/comment/commentId
router.post("{/:id}", isAuthenticated(), CommentService.addComment);
// to get specific comment by id
router.get("/:id/get-specific", isAuthenticated(), CommentService.getSpecificComment);
router.delete("/:id/delete", isAuthenticated(), CommentService.deleteComment);
router.patch("/:id/add-reaction", isAuthenticated(), CommentService.addReaction);
router.patch("/:id/freeze", isAuthenticated(), CommentService.freezeComment);
router.patch("/:id/unfreeze", isAuthenticated(), CommentService.unfreezeComment);
router.patch("/:id/update", isAuthenticated(), CommentService.updateComment);
router.delete("/:id/hard-delete", isAuthenticated(), CommentService.hardDeleteComment)



export default router;

// to make params optional in express 5 >> "{/:id}"
// in previous versions >> "/:id?"