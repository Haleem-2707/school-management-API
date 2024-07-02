const mongoose = require("mongoose");

const { Schema } = mongoose;

const classLevelSchema = new Schema(
  {
    //level 100/200/300/400
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
    // students will be added to the class level when thay are registered
    students: [
      {
        type: Schema.Types.ObjectId,
        ref: "Student",
      },
    ],

    subjects: [
      {
        type: Schema.Types.ObjectId,
        ref: "Subject",
      },
    ],
    teachers: [
      {
        type: Schema.Types.ObjectId,
        ref: "Teacher",
      },
    ],
  },
  { timestamps: true }
);

const classlevel = mongoose.model("ClassLevel", classLevelSchema);

module.exports = classlevel;
