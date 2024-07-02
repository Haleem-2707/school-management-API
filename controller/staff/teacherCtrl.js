const AsyncHandler = require("express-async-handler");
const Teacher = require("../../model/Staff/Teacher");
const { hashPassword, isPassMatched } = require("../../utils/helper");
const generateToken = require("../../utils/generateToken");

//@desc Admin Register Teacher
//@route POST /api/teachers/admin/register
//@acess Private

exports.adminRegisterTeacher = AsyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  //find the admin
  const adminFound = await Admin.findById(req.userAuth._id);
  if (!adminFound) {
    throw new Error("Admin not found");
  }
  //check if teacher already exists
  const teacher = await Teacher.findOne({ email });
  if (teacher) {
    throw new Error("Teacher already employed");
  }
  //Hash password
  const hashedPassword = await hashPassword(password);
  //create
  const teacherCreated = await Teacher.create({
    name,
    email,
    password: hashedPassword,
  });
  //push teacher into admin
  adminFound.teachers.push(teacherCreated?._id);
  await adminFound.save();
  //send teacher data
  res.status(201).json({
    status: "success",
    message: "Teacher registered successfully",
    data: teacherCreated,
  });
});

//@desc login a teacher
//@route POST /api/v1/teachers/login
//@access public

exports.loginTeacher = AsyncHandler(async (req, res) => {
  const { email, password } = req.body;
  //find the user
  const teacher = await Teacher.findOne({ email });
  if (!teacher) {
    return res.json({
      message: "Invalid login credentials",
    });
  }

  const isMatched = await isPassMatched(password, teacher?.password);
  if (!isMatched) {
    return res.json({ message: "Invalid login credentials" });
  } else {
    res.status(200).json({
      status: "success",
      message: "Teacher logged in successfully",
      data: generateToken(teacher?._id),
    });
  }
});

//@desc get all teachers
//@route POST /api/v1/admin/teachers
//@access private

exports.getAllTeachersAdmin = AsyncHandler(async (req, res) => {


   res.status(200).json(res.results);

 } );

//@desc get single teachers
//@route POST /api/v1/teachers/:
//@access private

exports.getTeacherByAdmin = AsyncHandler(async (req, res) => {
  const teacherID = req.params.teacherID;
  //find the teacher
  const teacher = await Teacher.findById(teacherID);
  if (!teacher) {
    throw new Error("Teacher not found");
  }

  res.status(200).json({
    status: "success",
    message: "Teachers fetched successfully",
    data: teacher,
  });
});

//@desc get teacher profile
//@route POST /api/v1/teachers/profile
//@access private Teacher only

exports.getTeacherProfile = AsyncHandler(async (req, res) => {
  const teacher = await Teacher.findById(req.userAuth?._id).select(
    "-password -createdAt -updatedAt"
  );

  if (!teacher) {
    throw new Error("Tecaher not found");
  }
  res.status(200).json({
    status: "success",
    data: teacher,
    message: "Teacher Profile fetched successfully",
  });
});

//@desc Update admin admin
//@router UPDATE /api/v1/teachers/:teacherID/update
//@access Private Teacher  only
exports.teacherUpdateProfile = AsyncHandler(async (req, res) => {
  const { email, name, password } = req.body;
  //find the admin
  // const adminFound = await Admin.findById(req.userAuth_id);
  //if email is taken
  const emailExist = await Teacher.findOne({ email });
  if (emailExist) {
    throw new Error("This email is taken/exist");
  }

  //hash password

  //check if user is updating password

  if (password) {
    //update
    const teacher = await Teacher.findByIdAndUpdate(
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
      data: teacher,
      message: "Admin updated successfully",
    });
  } else {
    //update
    const teacher = await Teacher.findByIdAndUpdate(
      req.userAuth._id,
      {
        email,
        name,
      },
      {
        new: true,
        runValidators: true,
      }
    );
    res.status(200).json({
      status: "success",
      data: teacher,
      message: "Admin updated successfully",
    });
  }
});

//@desc Admin updating teacher profile
//@router UPDATE /api/v1/teachers/:teacherID/admin
//@access Private Admin  only
exports.adminUpdateTeacher = AsyncHandler(async (req, res) => {
  const { program, classLevel, academicYear, subject } = req.body;
  //if email is taken
  const teacherFound = await Teacher.findById(req.params.teacherID);
  if (!teacherFound) {
    throw new Error("Teacher not found");
  }

  //check if teacher is withdrawn
  if (teacherFound.isWithdrawn) {
    throw new Error("Action denied, teacher is withrawn");
  }
  if (program) {
    //assign Program
    teacherFound.program = program;
    await teacherFound.save();

    res.status(200).json({
      status: "success",
      data: teacherFound,
      message: "Teacher updated successfully",
    });
  }

  //assign class level
  if (classLevel) {
    teacherFound.classLevel = classLevel;
    await teacherFound.save();
    res.status(200).json({
      status: "success",
      data: teacherFound,
      message: "Admin updated successfully",
    });
  }

  //assign class level
  if (academicYear) {
    teacherFound.academicYear = academicYear;
    await teacherFound.save();
    res.status(200).json({
      status: "success",
      data: teacherFound,
      message: "Admin updated successfully",
    });
  }

  //assign subject
  if (subject) {
    teacherFound.subject = subject;
    await teacherFound.save();
    res.status(200).json({
      status: "success",
      data: teacherFound,
      message: "Admin updated successfully",
    });
  }
});
