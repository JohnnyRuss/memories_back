import { model, Schema } from "mongoose";

const CommentSchema = new Schema(
  {
    post: {
      type: String,
      required: true,
    },
    author: {
      type: Schema.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    likesCount: {
      type: Number,
      default: 0,
    },
    likes: [
      {
        type: Schema.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

const Comment = model("Comment", CommentSchema);
export default Comment;
