const express = require("express");
const router = express.Router();
const { body } = require("express-validator"); // ✅ add this
const {
  createRecord,
  getAllRecords,
  getRecordById,
  updateRecord,
  deleteRecord,
} = require("../controllers/recordController");
const { protect, restrictTo } = require("../middleware/auth");

// Validation rules
const recordValidation = [
  body("amount")
    .notEmpty().withMessage("Amount is required")
    .isNumeric().withMessage("Amount must be a number")
    .custom((val) => val >= 0).withMessage("Amount cannot be negative"),

  body("type")
    .notEmpty().withMessage("Type is required")
    .isIn(["income", "expense"]).withMessage("Type must be income or expense"),

  body("category")
    .trim()
    .notEmpty().withMessage("Category is required"),

  body("date")
    .optional()
    .isISO8601().withMessage("Invalid date format"),
];

// All routes protected
router.use(protect);

// Viewer, Analyst, Admin
router.get("/", getAllRecords);
router.get("/:id", getRecordById);

// Admin only — with validation
router.post("/", restrictTo("admin"), recordValidation, createRecord);
router.patch("/:id", restrictTo("admin"), recordValidation, updateRecord);
router.delete("/:id", restrictTo("admin"), deleteRecord);

module.exports = router;