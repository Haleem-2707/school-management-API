const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    studentId: {
      type: String,
      required: true,
      default: function () {
        return (
          "STU" +
          Math.floor(100 + Math.random() * 900) +
          Date.now().toString().slice(2, 4) +
          this.name
            .split(" ")
            .map((name) => name[0])
            .join("")
            .toUpperCase()
        );
      },
    },

    isWithrawn: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      default: "student",
    },
    //Classes are from level 1 to 6
    //Keep track of the class level the student is in
    classLevels: [
      {
        type: String,
      },
    ],
    currentClassLevel: {
      type: String,
      default: function () {
        return this.classLevels[this.classLevels.length - 1];
      },
    },
    academicYear: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AcademicYear",
    },
    dateAdmitted: {
      type: Date,
      default: Date.now,
    },

    examResults: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ExamResult",
      },
    ],

    program: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Program",
    },

    isPromotedToLevel200: {
      type: Boolean,
      default: false,
    },
    isPromotedToLevel300: {
      type: Boolean,
      default: false,
    },
    isPromotedToLevel400: {
      type: Boolean,
      default: false,
    },
    isGraduated: {
      type: Boolean,
      default: false,
    },
    isWithrawn: {
      type: Boolean,
      default: false,
    },
    isSuspended: {
      type: Boolean,
      default: false,
    },
    prefectName: {
      type: String,
    },
    // behaviourReport: [
    //     {
    //         type: mongoose.Schema.Types.ObjectId,
    //         ref: "FinancialReport",
    //     },
    // ],
    // financialReport: [
    //     {
    //         type: mongoose.Schema.Types.ObjectId,
    //         ref: "FinancialReport",
    //     },
    // ],
    //year group
    yearGraduated: {
      type: String,
    },
  },

  {
    timestamps: true,
  }
);

//model
const student = mongoose.model("Student", studentSchema);

module.exports = student;
