const express = require("express");

const {
  adminToggleExamResult,
  checkExamResults,
  getAllExamResults,
} = require("../../controller/academics/examResults");
const isStudent = require("../../middlewares/isStudent");
const isStudentLogin = require("../../middlewares/isStudentLogin");
const isAdmin = require("../../middlewares/isAdmin");
const isLogin = require("../../middlewares/isLogin");

const examResultRouter = express.Router();

examResultRouter.get("/", isStudentLogin, isStudent, getAllExamResults);
examResultRouter.get(
  "/:id/checking",
  isStudentLogin,
  isStudent,
  checkExamResults
);

examResultRouter.put(
  "/:id/admin-toggle-public",
  isLogin,
  isAdmin,
  adminToggleExamResult
);

module.exports = examResultRouter;
