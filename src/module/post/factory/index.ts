import { IUser } from "../../../utils";
import { Post } from "../entity";
import { CreatePostDTO } from "../post.dto";

export class PostFactoryService {
  async createPost(createPostDTO: CreatePostDTO, user: IUser) {
    const newPost = new Post();
    newPost.content = createPostDTO.content;
    newPost.userId = user._id;
    newPost.reactions = [];
    newPost.attachments = [];
  

    return newPost;
  }

  update() {}
}
