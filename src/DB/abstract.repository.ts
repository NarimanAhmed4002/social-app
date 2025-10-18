import { Model, MongooseUpdateQueryOptions, ProjectionType, QueryOptions, RootFilterQuery, UpdateQuery } from "mongoose";
// abstract cannot be instantiated
// abstract class is a base class for other classes
// abstract class can have abstract methods (methods without implementation)
// abstract class can have concrete methods (methods with implementation)
export abstract class AbstractRepository <T> {
    constructor (protected model:Model<T>) {}

    async create (item:Partial <T>) {
        const doc = new this.model(item);
        return await doc.save()
    }
    
    async Exist(
        filter:RootFilterQuery<T>, 
        projection?: ProjectionType<T>, 
        options?: QueryOptions<T>) {
        return await this.model.findOne(filter, projection, options)
    }

    async getOne(
        filter:RootFilterQuery<T>, 
        projection?: ProjectionType<T>, 
        options?: QueryOptions<T>) /**Root, proj, options are generic type */{
        return await this.model.findOne(filter, projection, options)
    }

    async update (
        filter:RootFilterQuery<T>, 
        update:UpdateQuery<T>, 
        options?:MongooseUpdateQueryOptions
    ) {
        await this.model.updateOne(filter, update, options)
    }
    
    async delete (
        filter:RootFilterQuery<T>) {
        await this.model.deleteOne(filter)
    }
    
};

// A base repository defining common DB operations (create, findById, update) 
// that all repositories (like user.repository.ts) can extend.