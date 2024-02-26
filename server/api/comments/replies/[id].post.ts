import { comment, reply } from "../../../model";

interface IRequestBody {
  author: string;
  content: string;
}

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  const { author, content } = await readBody<IRequestBody>(event);
  try {
    const comments = await comment.findById(id);
    const replies = new reply({ author, content, commentId: comments._id });
    await replies.save();
    comments.replies.push(replies._id)
    await comments.save()
    return { replies, comments };
  } catch (err) {
    console.dir(err);
    event.res.statusCode = 400;
    return {
      code: "ERROR",
      message: "Something went wrong.",
    };
  }
});
