import { comment } from "../../model";

export default defineEventHandler(async (event) => {
  try {
    const comments = await comment.find().populate("replies");
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
