const AsyncHandler = require("express-async-handler");
const Subject = require("../../model/Academic/Subject");
const Program = require("../../model/Academic/Program");
const YearGroup = require("../../model/Academic/Yeargroup");
const Admin = require("../../model/Staff/Admin");

//@desc Create year group
//@router POST /api/v1/year-group
//@access Private
exports.createYearGroup = AsyncHandler(async (req, res) => {
  const { name, academicYear } = req.body;

  //find the program
  const yeargroup = await YearGroup.findOne({ name });
  if (yeargroup) {
    throw new Error("Year Group/Graduation already exists");
  }

  //create
  const yearGroup = await YearGroup.create({
    name,
    academicYear,
    createdBy: req.userAuth._id,
  });

  //push to program
  //find the admin
  const admin = await Admin.findById(req.userAuth._id);
  if (!admin) {
    throw new Error("Admin not found");
  }
  //push year group into admin
  admin.yearGroups.push(yearGroup._id);
  //   //save
  await admin.save();
  res.status(201).json({
    status: "success",
    message: "Year Group created successfully",
    data: yearGroup,
  });
});

//@desc get all year groups
//@router GET /api/v1/yeaar-groups
//@access Private
exports.getYearGroups = AsyncHandler(async (req, res) => {
  const groups = await YearGroup.find();

  res.status(201).json({
    status: "success",
    message: "Year Groups fetched successfully",
    data: groups,
  });
});

//@desc get single year group
//@router GET /api/v1/year-group/:id
//@access Private
exports.getYearGroup = AsyncHandler(async (req, res) => {
  const group = await YearGroup.findById(req.params.id);

  res.status(201).json({
    status: "success",
    message: "Year Group fetched successfully",
    data: group,
  });
});

//@desc update year group
//@router PUT /api/v1/subjects/:id
//@access Private
exports.updateYearGroup = AsyncHandler(async (req, res) => {
  const { name, academicYear } = req.body;
  //check name exists
  const yearGroupFound = await Subject.findOne({ name });
  if (yearGroupFound) {
    throw new Error("Year group already exists");
  }

  const yearGroup = await YearGroup.findByIdAndUpdate(
    req.params.id,
    {
      name,
      academicYear,
      createdBy: req.userAuth_id,
    },
    {
      new: true,
    }
  );

  res.status(201).json({
    status: "success",
    message: "Year Group updated successfully",
    data: yearGroup,
  });
});

//@desc get Delete year group
//@router PUT /api/v1/program/:id
//@access Private
exports.deleteYearGroup = AsyncHandler(async (req, res) => {
  await YearGroup.findByIdAndDelete(req.params.id);

  res.status(201).json({
    status: "success",
    message: "Year group deleted successfully",
  });
});
