import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IReply extends Document {
  text: string;
  authorId: string;
  authorName: string;
  createdAt: Date;
}

export interface IComment extends Document {
  text: string;
  authorId: string;
  authorName: string;
  replies: IReply[];
  createdAt: Date;
}

export interface IPostMessage extends Document {
  title: string;
  message: string;
  name: string;
  creator: string;
  tags: string[];
  selectedFile: string;
  likes: string[];
  comments: IComment[];
  createdAt: Date;
}

const replySchema: Schema = new mongoose.Schema({
  text: String,
  authorId: String,
  authorName: String,
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

const commentSchema: Schema = new mongoose.Schema({
  text: String,
  authorId: String,
  authorName: String,
  replies: { type: [replySchema], default: [] },
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

const postSchema: Schema = new mongoose.Schema({
  title: String,
  message: String,
  name: String,
  creator: String,
  tags: [String],
  selectedFile: String,
  likes: { type: [String], default: [] },
  comments: { type: [commentSchema], default: [] },
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

const PostMessage: Model<IPostMessage> = mongoose.model<IPostMessage>('PostMessage', postSchema);

export default PostMessage;
