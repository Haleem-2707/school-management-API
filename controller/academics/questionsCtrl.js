const AsyncHandler = require("express-async-handler");

const Question = require("../../model/Academic/Question");

const Exam = require("../../model/Academic/Exam");

//@desc Create Question
//@route POST /api/v1/questionsexams
//@access Private Teachers only

exports.createQuestion = AsyncHandler(async (req, res) => {
  const { question, optionA, optionB, optionC, optionD, correctAnswer } =
    req.body;

  const examFound = await Exam.findById(req.params.examID);
  if (!examFound) {
    throw new Error("Exam not found");
  }

  //check if question
  const questionExists = await Question.findOne({ question });
  if (questionExists) {
    throw new Error("Question already exists");
  }
  //create exam
  const questionCreated = await Question.create({
    question,
    optionA,
    optionB,
    optionC,
    optionD,
    correctAnswer,
    createdBy: req.userAuth._id,
  });

  //add the question into exam
  examFound.questions.push(questionCreated?._id);

  //save
  await examFound.save();
  res.status(201).json({
    status: "success",
    message: "Question created",
    date: questionCreated,
  });
});

//@desc get all Questions
//@router GET /api/v1/questions
//@access Private
exports.getQuestions = AsyncHandler(async (req, res) => {
  const questions = await Question.find();

  res.status(201).json({
    status: "success",
    message: "Question fetched successfully",
    data: questions,
  });
});

//@desc get sinle questions
//@router GET /api/v1/questions
//@access Private-Teacher only

//@desc get single Question
//@router GET /api/v1/question/:id
//@access Private
exports.getQuestion = AsyncHandler(async (req, res) => {
  const question = await Question.findById(req.params.id);

  res.status(201).json({
    status: "success",
    message: "Question fetched successfully",
    data: question,
  });
});

//@desc get Update Qustion
//@router PUT /api/v1/questions/:id
//@access Private Teacher ony
exports.updateQuestion = AsyncHandler(async (req, res) => {
  const { question, optionA, optionB, optionC, optionD, correctAnswer } =
    req.body;
  //check name exists
  const questionFound = await Question.findOne({ question });
  if (questionFound) {
    throw new Error("Question already exists");
  }

  const program = await Question.findByIdAndUpdate(
    req.params.id,
    {
      question,
      optionA,
      optionB,
      optionC,
      optionD,
      correctAnswer,
      createdBy: req.userAuth_id,
    },
    {
      new: true,
    }
  );

  res.status(201).json({
    status: "success",
    message: "Question updated successfully",
    data: program,
  });
});
