import { reply } from "~/server/model";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  try {
    const replies = await reply.findById(id);
    if (!replies) {
      event.res.statusCode = 404;
      return { message: "Reply tidak ditemukan" };
    }
    await replies.deleteOne();
    return { message: "Reply berhasil di hapus" };
  } catch (err) {
    console.dir(err);
    event.res.statusCode = 500;
    return {
      code: "ERROR",
      message: "Something went wrong.",
    };
  }
});
