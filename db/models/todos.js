const mongoose = require("mongoose")
const { string } = require("zod/v4")

const todoSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Low'
  },
  completed: {
    type: Boolean,
    default: false
  },
  dueDate: {
    type: Date
  }
}, {
  timestamps: true
});

const todos = new mongoose.model("todos" , todoSchema);
module.exports = todos