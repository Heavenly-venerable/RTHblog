import { comment } from "../../model";

interface IRequestBody {
  author: string;
  content: string;
  articleId: number;
}

export default defineEventHandler(async (event) => {
  try {
    const { author, content, articleId } = await readBody<IRequestBody>(event);
    const comments = new comment({ author, content, articleId });
    await comments.save();
    return comments;
  } catch (err) {
    console.dir(err);
    event.res.statusCode = 400;
    return {
      code: "ERROR",
      message: "Something went wrong.",
    };
  }
});
