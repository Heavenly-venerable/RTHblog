import { comment } from "~/server/model";
import { reply } from "~/server/model";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "commentId");
  try {
    const comments = await comment.findById(id);
    if (!comments) {
      event.res.statusCode = 404;
      return { message: "Komentar tidak ditemukan" };
    }
    await reply.deleteMany({ commentId: comments._id });
    await comments.deleteOne();
    return { message: "Komentar berhasil di hapus" };
  } catch (err) {
    console.dir(err);
    event.res.statusCode = 500;
    return {
      code: "ERROR",
      message: "Something went wrong.",
    };
  }
});
