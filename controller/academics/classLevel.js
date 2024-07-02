const AsyncHandler = require("express-async-handler");
const ClassLevel = require("../../model/Academic/ClassLevel");
const Admin = require("../../model/Staff/Admin");

//@desc Create Class level
//@router POST /api/v1/academic-years
//@access Private
exports.createClassLevel = AsyncHandler(async (req, res) => {
  const { name, description, duration } = req.body;

  //check if exists
  const classFound = await ClassLevel.findOne({ name });
  if (classFound) {
    throw new Error("Class already exists");
  }
  //create
  const classCreated = await ClassLevel.create({
    name,
    description,
    createdBy: req.userAuth._id,
  });

  //push academic year into admin
  const admin = await Admin.findById(req.userAuth._id);
  admin.classLevels.push(classCreated._id);

  await admin.save();

  res.status(201).json({
    status: "success",
    message: "Class created successfully",
    data: classCreated,
  });
});

//@desc get all Class levels
//@router GET /api/v1/class-levels
//@access Private
exports.getClassLevels = AsyncHandler(async (req, res) => {
  const classes = await ClassLevel.find();

  res.status(201).json({
    status: "success",
    message: "Class Levels fetched successfully",
    data: classes,
  });
});

//@desc get single Academic Years
//@router GET /api/v1/academic-years/:id
//@access Private
exports.getClassLevel = AsyncHandler(async (req, res) => {
  const classLevel = await ClassLevel.findById(req.params.id);

  res.status(201).json({
    status: "success",
    message: "Class fetched successfully fetched successfully",
    data: classLevel,
  });
});

//@desc get Update Class Level
//@router PUT /api/v1/class-level/:id
//@access Private
exports.updateClassLevel = AsyncHandler(async (req, res) => {
  const { name, description } = req.body;
  //check name exists
  const classFound = await ClassLevel.findOne({ name });
  if (classFound) {
    throw new Error("Class already exists");
  }

  const classLevel = await ClassLevel.findByIdAndUpdate(
    req.params.id,
    {
      name,
      description,
      createdBy: req.userAuth_id,
    },
    {
      new: true,
    }
  );

  res.status(201).json({
    status: "success",
    message: "class level updated successfully",
    data: academicLevel,
  });
});

//@desc get Update class level
//@router PUT /api/v1/class-level/:id
//@access Private
exports.deleteClassLevel = AsyncHandler(async (req, res) => {
  await ClassLevel.findByIdAndDelete(req.params.id);

  res.status(201).json({
    status: "success",
    message: "Class level deleted successfully",
  });
});
