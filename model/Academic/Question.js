const mongoose = require("mongoose");

const { Schema } = mongoose;

//questionSchema
const questionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
    },

    optionA: {
      type: String,
      required: true,
    },
    optionB: {
      type: String,
      required: true,
    },
    optionC: {
      type: String,
      required: true,
    },
    optionD: {
      type: String,
      required: true,
    },
    correctAnswer: {
      type: String,
      required: false,
    },
    isCorrect: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "Teacher",
      required: true,
    },
  },

  {
    timestamps: true,
  }
);

const question = mongoose.model("Question", questionSchema);

module.exports = question;
