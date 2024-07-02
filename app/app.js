const express = require("express");
const {
  globalErrHandler,
  notFoundErr,
} = require("../middlewares/globalErrHandler");

const academicTermRouter = require("../routes/academics/academicTerm");
const academicYearRouter = require("../routes/academics/academicYear");
const classLevelRouter = require("../routes/academics/classLevel");
const programRouter = require("../routes/academics/program");
const subjectRouter = require("../routes/academics/subject");
const adminRouter = require("../routes/staff/adminRouter");
const yearGroupRouter = require("../routes/academics/yearGroups");
const teachersRouter = require("../routes/staff/teacher");
const examRouter = require("../routes/academics/examRoutes");
const studentRouter = require("../routes/staff/student");
const questionRouter = require("../routes/academics/questionRoutes");
const examResultRouter = require("../routes/academics/examResultsRoute");
const app = express();

//MIDDLE WARES
// app.use(morgan("dev"));
app.use(express.json()); //pass incoming json data

//Routes
app.use("/api/v1/admins/", adminRouter);
app.use("/api/v1/academic-years", academicYearRouter);
app.use("/api/v1/academic-terms", academicTermRouter);
app.use("/api/v1/class-levels", classLevelRouter);
app.use("/api/v1/programs", programRouter);
app.use("/api/v1/subjects", subjectRouter);
app.use("/api/v1/year-groups", yearGroupRouter);
app.use("/api/v1/teachers", teachersRouter);
app.use("/api/v1/exams", examRouter);
app.use("/api/v1/students", studentRouter);
app.use("/api/v1/questions", questionRouter);
app.use("/api/v1/exam-results", examResultRouter);

//Error middlewares
app.use(notFoundErr);
app.use(globalErrHandler);

module.exports = app;
