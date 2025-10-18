"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DBUserServices = void 0;
const abstract_repository_1 = require("../../abstract.repository");
const user_model_1 = require("./user.model");
class DBUserServices extends abstract_repository_1.AbstractRepository {
    constructor() {
        super(user_model_1.User);
    }
    async getAllUsers() {
        return await this.model.find();
    }
}
exports.DBUserServices = DBUserServices;
