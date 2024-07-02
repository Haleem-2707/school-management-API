const AsyncHandler = require("express-async-handler");
const Student = require("../../model/Academic/Student");
const { hashPassword, isPassMatched } = require("../../utils/helper");
const generateToken = require("../../utils/generateToken");
const Exam = require("../../model/Academic/Exam");
const ExamResults = require("../../model/Academic/ExamResults");
const { getQuestions } = require("../academics/questionsCtrl");
const Admin = require("../../model/Staff/Admin");

// const ExamResults = require("../../model/Academic/ExamResults");

//@desc Admin Register StudentS
//@route POST /api/students/admin/register
//@acess Private Admin only

exports.adminRegisterStudent = AsyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  //find the admin
  const adminFound = await Admin.findById(req.userAuth._id);
  if (!adminFound) {
    throw new Error("Admin not found");
  }
  //check if teacher already exists
  const student = await Student.findOne({ email });
  if (student) {
    throw new Error("Student already employed");
  }
  //Hash password
  const hashedPassword = await hashPassword(password);
  //create
  const studentRegistered = await Student.create({
    name,
    email,
    password: hashedPassword,
  });
  //push teacher into admin
  adminFound.students.push(studentRegistered?._id);
  await adminFound.save();

  //send teacher data
  res.status(201).json({
    status: "success",
    message: "Student registered successfully",
    data: studentRegistered,
  });
});

//@desc login a teacher
//@route POST /api/v1/students/login
//@access public

exports.loginStudent = AsyncHandler(async (req, res) => {
  const { email, password } = req.body;
  //find the user
  const student = await Student.findOne({ email });
  if (!student) {
    return res.json({
      message: "Inwalid login credentials",
    });
  }

  const isMatched = await isPassMatched(password, student?.password);
  if (!isMatched) {
    return res.json({ message: "Invalid login credentials" });
  } else {
    res.status(200).json({
      status: "success",
      message: "Student logged in successfully",
      data: generateToken(student?._id),
    });
  }
});

//@desc get Student Profile
//@route POST /api/v1/students/profile
//@access private Student only

exports.getStudentProfile = AsyncHandler(async (req, res) => {
  const student = await Student.findById(req.userAuth?._id)
    .select("-password -createdAt -updatedAt")
    .populate("examResults");

  if (!student) {
    throw new Error("Student not found");
  }

  //get student profile
  const studentProfile = {
    name: student?.name,
    email: student?.email,
    currentClassLevel: student?.currentClassLevel,
    program: student?.program,
    dateAdmitted: student?.dateAdmitted,
    isSuspended: student?.isSuspended,
    isWithrawn: student?.isWithrawn,
    studentId: student?.studentId,
    prefectName: student?.prefectName,
  };
  //get student exam results

  const examResults = student?.examResults;
  //current exam
  const currentExamResult = examResults[examResults.length - 1];
  //check if exam is published
  const isPublished = currentExamResult?.isPublished;
  res.status(200).json({
    status: "success",
    data: {
      studentProfile,
      currentExamResult: isPublished ? currentExamResult : [],
    },
    message: "Student Profile fetched successfully",
  });
});

//@desc get all students
//@route POST /api/v1/admin/teachers
//@access private

exports.getAllStudentsByAdmin = AsyncHandler(async (req, res) => {
  const students = await Student.find();
  res.status(200).json({
    status: "success",
    message: "Students fetched successfully",
    data: students,
  });
});

//@desc get single Student
//@route POST /api/v1/students/:studentID/admin
//@access private admin only

exports.getStudentByAdmin = AsyncHandler(async (req, res) => {
  const studentID = req.params.studentID;
  //find the teacher
  const student = await Student.findById(studentID);
  if (!student) {
    throw new Error("Student not found");
  }

  res.status(200).json({
    status: "success",
    message: "Student fetched successfully",
    data: student,
  });
});

//@desc Update admin admin
//@router UPDATE /api/v1/students/:studentID/update
//@access Private Student  only
exports.studentUpdateProfile = AsyncHandler(async (req, res) => {
  const { email, password } = req.body;
  //find the admin
  // const adminFound = await Admin.findById(req.userAuth_id);
  //if email is taken
  const emailExist = await Student.findOne({ email });
  if (emailExist) {
    throw new Error("This email is taken/exist");
  }

  //hash password

  //check if user is updating password

  if (password) {
    //update
    const student = await Student.findByIdAndUpdate(
      req.userAuth._id,
      {
        email,
        password: await hashPassword(password),
        name,
      },
      {
        new: true,
        runValidators: true,
      }
    );
    res.status(200).json({
      status: "success",
      data: student,
      message: "Student updated successfully",
    });
  } else {
    //update
    const student = await Student.findByIdAndUpdate(
      req.userAuth._id,
      {
        email,
      },
      {
        new: true,
        runValidators: true,
      }
    );
    res.status(200).json({
      status: "success",
      data: student,
      message: "student updated successfully",
    });
  }
});

//@desc Admin updating teacher e.g: Assigning classes....
//@router UPDATE /api/v1/students/:studentID/update/admin
//@access Private Admin  only

exports.adminUpdateStudent = AsyncHandler(async (req, res) => {
  const { classLevels, academicYear, program, name, email, prefectName } =
    req.body;

  //find the student by id
  const studentFound = await Student.findById(req.params.studentID);
  if (!studentFound) {
    throw new Error("Student not found");
  }

  //update
  const studentUpdated = await Student.findByIdAndUpdate(
    req.params.studentID,
    {
      $set: {
        name,
        email,
        academicYear,
        program,
        prefectName,
      },
      $addToSet: {
        classLevels,
      },
    },
    {
      new: true,
    }
  );
  //send response
  res.status(200).json({
    status: "success",
    data: studentUpdated,
    message: "Student Updated Successfully",
  });
});

//@desc Student taking Exams
//@router UPDATE /api/v1/students/exams/:examID/write
//@access Private Students  only

exports.writeExam = AsyncHandler(async (req, res) => {
  //get student

  const studentFound = await Student.findById(req.userAuth?._id);
  if (!studentFound) {
    throw new Error("Student not found");
  }

  //get exam
  const examFound = await Exam.findById(req.params.examID)
    .populate("questions")
    .populate("classLevel")
    .populate("academicTerm")
    .populate("academicYear");

  if (!examFound) {
    throw new Error("Exam not found");
  }
  const questions = examFound?.questions;

  const studentAnswers = req.body.answers;

  // //check if student answered all questions
  if (studentAnswers.length !== questions.length) {
    throw new Error("You have not answered all the questions");
  }

  // // // //check if the student has already taken the examination
  const studentFoundInResults = await ExamResults.findOne({
    student: studentFound?._id,
  });
  if (studentFoundInResults) {
    throw new Error("You have already written this exam");
  }

  //Ckeck if student is suspended/withdrawn
  if (studentFound.isWithrawn || studentFound.isSuspended) {
    throw new Error("You are suspended/withdrawn, you can't take this exam");
  }
  let correctanswers = 0;
  let wrongAnswers = 0;
  let status = ""; //failed/passed
  let remarks = "";
  let grade = 0;
  let score = 0;
  let answeredQuestions = [];

  //check for answers
  for (let i = 0; i < questions.length; i++) {
    //find the questions
    const question = questions[i];
    //check if the answer is correct
    if (question.correctAnswer === studentAnswers[i]) {
      correctanswers++;
      score++;
      question.isCorrect = true;
    } else {
      wrongAnswers++;
    }
  }

  //Build report object
  totalQuestions = questions.length;
  grade = (correctanswers / questions.length) * 100;
  answeredQuestions = questions.map((questions) => {
    return {
      question: questions.question,
      correctanswer: questions.correctAnswer,
      isCorrect: questions.isCorrect,
    };
  });

  //calculate status
  if (grade >= 50) {
    status = "Pass";
  } else {
    status = "Fail";
  }

  //Remarks
  if (grade >= 80) {
    remarks = "Excellent";
  } else if (grade >= 70) {
    remarks = "Very Good";
  } else if (grade >= 60) {
    remarks = "Good";
  } else if (grade >= 50) {
    remarks = "Fair";
  } else {
    remarks = "Poor";
  }

  //Generate Exam Results
  const examResults = await ExamResults.create({
    studentID: studentFound?.studentId,
    exam: examFound?._id,
    grade,
    score,
    status,
    remarks,
    classLevel: examFound?.classLevel,
    academicTerm: examFound?.academicTerm,
    academicYear: examFound?.academicYear,
    answeredQuestions: answeredQuestions,
  });
  //push the results into
  studentFound.examResults.push(examResults?._id);
  //save
  await studentFound.save();

  //Promoting
  //promote student to level 200
  if (
    examFound.academicTerm.name === "3rd term" &&
    status === "Pass" &&
    studentFound?.currentClassLevel === "Level 100"
  ) {
    studentFound.classLevels.push("Level 200");
    studentFound.currentClassLevel = "Level 200";
    await studentFound.save();
  }

  //promote student to level 300
  if (
    examFound.academicTerm.name === "3rd term" &&
    status === "Pass" &&
    studentFound?.currentClassLevel === "Level 200"
  ) {
    studentFound.classLevels.push("Level 300");
    studentFound.currentClassLevel = "Level 300";
    await studentFound.save();
  }

  //promote student to level 400
  if (
    examFound.academicTerm.name === "3rd term" &&
    status === "Pass" &&
    studentFound?.currentClassLevel === "Level 300"
  ) {
    studentFound.classLevels.push("Level 400");
    studentFound.currentClassLevel = "Level 400";
    await studentFound.save();
  }

  //promote student to graduate
  if (
    examFound.academicTerm.name === "3rd term" &&
    status === "Pass" &&
    studentFound?.currentClassLevel === "Level 400"
  ) {
    studentFound.isGraduated = true;
    studentFound.yearGraduated = new Date();
    await studentFound.save();
  }

  res.status(200).json({
    status: "success",
    data: "You have submitted your exam. check later for the result",
    // examResults,
  });
});

//get questions

//get students questions

//Remarks
