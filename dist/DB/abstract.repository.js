"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractRepository = void 0;
// abstract cannot be instantiated
// abstract class is a base class for other classes
// abstract class can have abstract methods (methods without implementation)
// abstract class can have concrete methods (methods with implementation)
class AbstractRepository {
    model;
    constructor(model) {
        this.model = model;
    }
    async create(item) {
        const doc = new this.model(item);
        return await doc.save();
    }
    async Exist(filter, projection, options) {
        return await this.model.findOne(filter, projection, options);
    }
    async getOne(filter, projection, options) {
        return await this.model.findOne(filter, projection, options);
    }
    async update(filter, update, options) {
        await this.model.updateOne(filter, update, options);
    }
    async delete(filter) {
        await this.model.deleteOne(filter);
    }
}
exports.AbstractRepository = AbstractRepository;
;
// A base repository defining common DB operations (create, findById, update) 
// that all repositories (like user.repository.ts) can extend.
