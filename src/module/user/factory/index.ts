import { generateHash } from "../../../utils";
import { UpdateUser } from "../entity";
import { UpdateDTO } from "../user.dto";

export class UserFactoryService {
    updateBasicInfo(updateDTO: UpdateDTO) {
        const user = new UpdateUser();
        user.firstName = updateDTO.firstName;
        user.lastName = updateDTO.lastName;
        user.phone = updateDTO.phone;
        user.gender = updateDTO.gender;
        return user;
    }
}