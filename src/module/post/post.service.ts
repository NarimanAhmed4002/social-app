import { Request, Response } from "express";
import { CreatePostDTO } from "./post.dto";
import { PostFactoryService } from "./factory";
import { PostRepository } from "../../DB";
import { NotFoundException, REACTION } from "../../utils";

class PostService {
    private readonly postFactoryService = new PostFactoryService()
    private readonly postRepository = new PostRepository()


    public create = async (req:Request, res:Response)=>{
        // get data from req
        const createPostDTO:CreatePostDTO = req.body;
        // factory >> prepare data post >> post entity >> repository
        // repository >> post entity >> DB
        const post = await this.postFactoryService.createPost(createPostDTO, req.user)
        // save in DB
        const createdPost = await this.postRepository.create(post);
        // 
        return res.status(201).json({
            message:"Post created successfully.",
            success:true,
            data:{createdPost}
        })
    };

    public addReaction = async(req:Request, res:Response)=>{
        // get data from req
        const { id } = req.params;  // post id
        const { reaction } = req.body;  // user reaction
        const userId = req.user._id;    // user id
        // check post existence
        const postExist = await this.postRepository.Exist({_id:id});
        if(!postExist) throw new NotFoundException("Post not found.");
        
        let userReactedIndex = postExist.reactions.findIndex((reaction)=>{
            return reaction.userId.toString() == userId.toString();
        })

        if(userReactedIndex == -1){
        await this.postRepository.update(
            {_id:id},
            {$push:{
                reactions:
                {reaction:
                    // if (reaction == null | undefined)  {REACTION.like}  else {reaction}
                    [null, undefined].includes(reaction) ? REACTION.like  : reaction, 
                    userId }
                }}
        );
        } // if req.body = undefined, null, "" , this means "remove reaction".
        else if([undefined, null, ""].includes(reaction)){
            await this.postRepository.update(
                {_id:id},
                {$pull:{reactions:postExist.reactions[userReactedIndex]}}
            )
        }
         else{
            await this.postRepository.update(
                {_id: id, "reactions.userId": userId},
            {"reactions.$.reaction": reaction}
            );
        };
        
        // send response
        return res.status(204)

    }
}

export default new PostService();