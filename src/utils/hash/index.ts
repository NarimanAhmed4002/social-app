import bcrypt from 'bcryptjs';
import { number } from 'zod';
export const generateHash = (password:string)=>{
    return bcrypt.hashSync(password, 10)
}

export const compareHash = async (password:string , hashPassword:string)=>{
    return await bcrypt.compare(password, hashPassword)
};

// Utility functions for hashing passwords and comparing hashes.
// password hashing utilities (e.g., using bcrypt).