// controller for course-related routes

const courseService = require("../services/course.service");
const connectDB = require("../config/db");

const getCourses = async (req, res) => {
  try {
    // Ensure DB connection before processing request (for serverless)
    await connectDB();
    const data = await courseService.getCourses(req.query);
    res.json(data);
  } catch (err) {
    console.error("Get courses error:", err.message);
    res.status(400).json({ message: err.message || "Failed to fetch courses" });
  }
};

const getCourseById = async (req, res) => {
  try {
    await connectDB();
    const course = await courseService.getCourseById(req.params.id);
    res.json(course);
  } catch (err) {
    const status = err.statusCode || (err.name === "CastError" ? 400 : 404);
    res.status(status).json({ success: false, message: err.message });
  }
};

module.exports = { getCourses, getCourseById };
