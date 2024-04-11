import mongoose from "mongoose"

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true
  },
  category: {
    type: String,
    default: 'uncategorized'
  },
  content: {
    type: String,
    required: true
  },
  userId: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  image: {
    type: String,
    default: "https://www.blogtyrant.com/wp-content/uploads/2020/02/how-long-should-a-blog-post-be.png"
  }
}, {timestamps: true})

const Post = mongoose.model('Post', postSchema)

export default Post
