const express = require("express");

const {
  createSubject,
  deleteSubject,
  getSubjects,
  getSubject,
  updateSubject,
} = require("../../controller/academics/subjects");

const isAdmin = require("../../middlewares/isAdmin");
const isLogin = require("../../middlewares/isLogin");

const subjectRouter = express.Router();

subjectRouter.post("/:programID", isLogin, isAdmin, createSubject);

subjectRouter.get("/", isLogin, isAdmin, getSubjects);

subjectRouter.get("/:id", isLogin, isAdmin, getSubject);
subjectRouter.put("/:id", isLogin, isAdmin, updateSubject);
subjectRouter.delete("/:id", isLogin, isAdmin, deleteSubject);

module.exports = subjectRouter;
