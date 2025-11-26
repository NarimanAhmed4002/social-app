import { UpdateUser } from "../entity";
import { UpdateDTO } from "../user.dto";

export class UserFactoryService {
    updateBasicInfo(updateDTO: UpdateDTO) {
        const user = new UpdateUser();
        user.fullName = updateDTO.fullName;
        user.phone = updateDTO.phone;
        user.gender = updateDTO.gender;
        return user;
    }
}