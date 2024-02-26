import { comment } from "~/server/model";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "articleId");
  try {
    const comments = await comment.find({ articleId: id }).populate("replies");
    return comments;
  } catch (err) {
    console.dir(err);
    event.res.statusCode = 500;
    return {
      code: "ERROR",
      message: "Something went wrong.",
    };
  }
});
