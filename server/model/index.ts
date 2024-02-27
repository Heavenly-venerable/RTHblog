import mongoose from "mongoose";
import replySchema from "./reply.model";
import commentSchema from "./comment.model";

export const reply = mongoose.model("Reply", replySchema);
export const comment = mongoose.model("Comment", commentSchema);

//export { default as comment } from "./comment.model";
//export { default as reply } from "./reply.model";
