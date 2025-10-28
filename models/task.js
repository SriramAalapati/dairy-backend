const mongoose = require('mongoose');
const { Schema } = mongoose;

const taskSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User', // Reference to the user who owns this task
      required: true,
    },
    task: {
      type: String,
      required: true,
      trim: true,
    },
    priority: {
      type: Number,
      required: true,
      min: 1, // Optional: ensures priority is at least 1
    },
  },
  {
    collection: 'tasks',
    timestamps: true, // Adds createdAt and updatedAt
  }
);

module.exports = mongoose.model('Task', taskSchema);
