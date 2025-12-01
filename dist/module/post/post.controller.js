"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const post_service_1 = __importDefault(require("./post.service"));
const __1 = require("..");
const router = (0, express_1.Router)();
router.use("/:postId/comment", (0, auth_middleware_1.isAuthenticated)(), __1.commentRouter); // use NOTT post
router.post("/", (0, auth_middleware_1.isAuthenticated)(), post_service_1.default.create);
// patch is used to update one field
router.patch("/:id", (0, auth_middleware_1.isAuthenticated)(), post_service_1.default.addReaction);
router.get("/:id", post_service_1.default.getSpecificPost); // public API: anyone can get a specific post by id : login not required
router.delete("/:id", (0, auth_middleware_1.isAuthenticated)(), post_service_1.default.deletePost);
router.patch("/:postId/freeze", (0, auth_middleware_1.isAuthenticated)(), post_service_1.default.freezePost);
router.patch("/:postId/unfreeze", (0, auth_middleware_1.isAuthenticated)(), post_service_1.default.unfreezePost);
exports.default = router;
