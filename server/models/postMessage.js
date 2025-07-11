import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  text: String,
  authorId: String,
  authorName: String,
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

const postSchema = mongoose.Schema({
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
})

var PostMessage = mongoose.model('PostMessage', postSchema);

export default PostMessage;