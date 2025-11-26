"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_service_1 = __importDefault(require("./user.service"));
const auth_middleware_1 = require("../../middleware/auth.middleware");
const router = (0, express_1.Router)();
router.get("/:id", (0, auth_middleware_1.isAuthenticated)(), user_service_1.default.getProfile);
router.put("/basic-info", (0, auth_middleware_1.isAuthenticated)(), user_service_1.default.updateBasicInfo);
exports.default = router;
