const AsyncHandler = require("express-async-handler");
const ExamResult = require("../../model/Academic/ExamResults");
const { Error } = require("mongoose");

//@desc Exam results checking
//@route POST /api/v1/exams-results/:id/checking
//@access Private-Students only

exports.checkExamResults = AsyncHandler(async (req, res) => {
  //find the student
  const studentFound = await Student.findById(req.userAuth?._id);
  if (!studentFound) {
    throw new Error("No Student Found");
  }

  //find the exam results
  const examResult = await ExamResult.findOne({
    studentID: studentFound?.studenId,
    _id: req.params.id,
  })
    .populate("exam")
    .populate("clasLevel")
    .populate("academicTerm")
    .populate("academicYear");

  //check if exam result is published
  if (!examResult?.isPublished === false) {
    throw new Error("Exam result is not available, check out later");
  }
  res.json({
    status: "success",
    message: "Exam result",
    data: examResult,
    student: studentFound,
  });
});

//@desc Exam results checking("name", id)
//@route POST /api/v1/exams-results/:id/checking
//@access Private-Students only

exports.getAllExamResults = AsyncHandler(async (req, res) => {
  const results = await ExamResult.find().select("select").populate("exam");
  res.status(200).json({
    status: "sucess",
    message: "Exam Results fetched",
    data: results,
  });
});

//@desc Admin publish exam results
//@route POST /api/v1/exams-results/:id/admin-publish
//@access Private-Admin only

exports.adminToggleExamResult = AsyncHandler(async (req, res) => {
  //find the exam results
  const examResult = await ExamResult.findById(req.params.id);
  if (!examResult) {
    throw new Error("Exam result not found");
  }
  const publishResult = await ExamResult.findByIdAndUpdate(
    req.params.id,
    {
      isPublished: req.body.publish,
    },
    {
      new: true,
    }
  );
  res.status(200).json({
    status: "sucess",
    message: "Exam Results Updated",
    data: publishResult,
  });
});
