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
    update() { }
    delete() { }
    getOne() { }
}
exports.AbstractRepository = AbstractRepository;
