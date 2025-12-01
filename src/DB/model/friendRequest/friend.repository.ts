import { IFriendRequest } from "../../../utils";
import { AbstractRepository } from "../../abstract.repository";
import { FriendRequest } from "./friendRequest.model";

export class FriendRequestRepository extends AbstractRepository <IFriendRequest>{
    constructor() {
        super(FriendRequest)
    }
}