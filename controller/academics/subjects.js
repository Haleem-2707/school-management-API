const AsyncHandler = require("express-async-handler");
const Subject = require("../../model/Academic/Subject");
const Program = require("../../model/Academic/Program");
const Admin = require("../../model/Staff/Admin");

//@desc Create Create Subject
//@router POST /api/v1/subject/:program
//@access Private
exports.createSubject = AsyncHandler(async (req, res) => {
  const { name, description, academicTerm } = req.body;

  //find the program
  const programFound = await Program.findById(req.params.programID);
  if (!programFound) {
    throw new Error("Program not found");
  }
  //check if exists
  const subjectFound = await Subject.findOne({ name });
  if (subjectFound) {
    throw new Error("Subject already exists");
  }
  //create
  const subjectCreated = await Subject.create({
    name,
    description,
    academicTerm,
    createdBy: req.userAuth._id,
  });

  //push to program
  programFound.subjects.push(subjectCreated._id);
  //save
  await programFound.save();
  res.status(201).json({
    status: "success",
    message: "Program created successfully",
    data: subjectCreated,
  });
});

//@desc get all Subject
//@router GET /api/v1/subjects
//@access Private
exports.getSubjects = AsyncHandler(async (req, res) => {
  const classes = await Subject.find();

  res.status(201).json({
    status: "success",
    message: "Subjects fetched successfully",
    data: classes,
  });
});

//@desc get single  Subject
//@router GET /api/v1/subjects/:id
//@access Private
exports.getSubject = AsyncHandler(async (req, res) => {
  const program = await Subject.findById(req.params.id);

  res.status(201).json({
    status: "success",
    message: "Subject fetched successfully",
    data: program,
  });
});

//@desc get Update Subject
//@router PUT /api/v1/subjects/:id
//@access Private
exports.updateSubject = AsyncHandler(async (req, res) => {
  const { name, description, academicTerm } = req.body;
  //check name exists
  const subjectFound = await Subject.findOne({ name });
  if (subjectFound) {
    throw new Error("Program already exists");
  }

  const subject = await Subject.findByIdAndUpdate(
    req.params.id,
    {
      name,
      description,
      academicTerm,
      createdBy: req.userAuth_id,
    },
    {
      new: true,
    }
  );

  res.status(201).json({
    status: "success",
    message: "Subject updated successfully",
    data: subject,
  });
});

//@desc get Delete subject
//@router PUT /api/v1/program/:id
//@access Private
exports.deleteSubject = AsyncHandler(async (req, res) => {
  await Subject.findByIdAndDelete(req.params.id);

  res.status(201).json({
    status: "success",
    message: "Subject deleted successfully",
  });
});
