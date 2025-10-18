import { IUser } from '../../../utils';
import { AbstractRepository } from '../../abstract.repository';
import { User } from './user.model';
export class UserRepository extends AbstractRepository <IUser>{
    constructor() {
        super(User);
    }
    async getAllUsers(){
        return await this.model.find()
    }
};

// Acts as a data access layer between the business logic and database.
// It abstracts DB operations and provides reusable methods (e.g., findUserByEmail()).