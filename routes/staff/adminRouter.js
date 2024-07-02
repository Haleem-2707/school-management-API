const express = require("express");

const {
  registerAdminCtrl,
  adminPublishResultCtrl,
  adminSuspendTeacherCtrl,
  adminUnpublishResultCtrl,
  adminUnsuspendTeacherCtrl,
  adminWihrawTeacherCtrl,
  adminUnwithrawTeacherCtrl,
  deleteAdminCtrl,
  getAdminProfileCtrl,
  getAdminsCtrl,
  loginAdminCtrl,
  updateAdminCtrl,
} = require("../../controller/staff/adminController");
const isAdmin = require("../../middlewares/isAdmin");
const isLogin = require("../../middlewares/isLogin");
const advancedResults = require("../../middlewares/advancedResults");
const Admin = require("../../model/Staff/Admin");
const isAuthenticated = require("../../middlewares/isAuthenticated");
const roleRestriction = require("../../middlewares/roleRestriction");


const adminRouter = express.Router();

//Register
adminRouter.post("/register", registerAdminCtrl);

//admin login
adminRouter.post("/login", loginAdminCtrl);

//get all
adminRouter.get("/", isLogin,advancedResults(Admin), getAdminsCtrl);

//single
adminRouter.get("/profile",isAuthenticated(Admin), roleRestriction("admin"), getAdminProfileCtrl);

//update
adminRouter.put("/", isLogin, roleRestriction("admin"), updateAdminCtrl);

//delete
adminRouter.delete("/:id", deleteAdminCtrl);

//suspend
adminRouter.put("/suspend/teacher/:id", adminSuspendTeacherCtrl);

//unsuspend
adminRouter.put("/unsuspend/teacher/:id", adminUnsuspendTeacherCtrl);

// //withrawing teacher
adminRouter.put("/withraw/teacher/:id", adminWihrawTeacherCtrl);

//unwithraw teacher
adminRouter.put("/unwithraw/teacher/:id", adminUnwithrawTeacherCtrl);

//publish examination result
adminRouter.put("/publish/exam/:id", adminPublishResultCtrl);

//unpublish examination result
adminRouter.put("/unpublish/exam/:id", adminUnpublishResultCtrl);

module.exports = adminRouter;
