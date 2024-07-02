const express = require("express");

const {
  adminRegisterStudent,
  loginStudent,
  getStudentProfile,
  getAllStudentsByAdmin,
  getStudentByAdmin,
  studentUpdateProfile,
  adminUpdateStudent,
  writeExam,
} = require("../../controller/Students/studentsCtrl");
const isAdmin = require("../../middlewares/isAdmin");
const isLogin = require("../../middlewares/isLogin");
const isStudent = require("../../middlewares/isStudent");
const isStudentLogin = require("../../middlewares/isStudentLogin");
const isAuthenticated = require("../../middlewares/isAuthenticated");
const student = require("../../model/Academic/Student");
const roleRestriction = require("../../middlewares/roleRestriction");
const admin = require("../../model/Staff/Admin");




const studentRouter = express.Router();

studentRouter.post("/admin/register", isLogin, isAdmin, adminRegisterStudent);
studentRouter.post("/login", loginStudent);
studentRouter.get("/profile", isAuthenticated(student), roleRestriction("student"), getStudentProfile);
studentRouter.get("/admin", isAuthenticated(admin), roleRestriction("admin"), getAllStudentsByAdmin);
studentRouter.get("/:studentID/admin", isAuthenticated(student), roleRestriction("admin"), getStudentByAdmin);
studentRouter.post("/exam/:examID/write", isAuthenticated(student), roleRestriction("student"), writeExam);


studentRouter.put("/update", isAuthenticated(student),roleRestriction("student") , studentUpdateProfile);
studentRouter.put(
  "/:studentID/update/admin",
  isAuthenticated(admin),
  roleRestriction("admin"),
  adminUpdateStudent
);

module.exports = studentRouter;
