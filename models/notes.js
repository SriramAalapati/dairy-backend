const mongoose = require('mongoose');
const { Schema } = mongoose;

const noteSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User', // reference to the user who owns the note
      required: true,
    },
    note: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    collection: 'notes',
    timestamps: true, // adds createdAt and updatedAt
  }
);

module.exports = mongoose.model('Note', noteSchema);
