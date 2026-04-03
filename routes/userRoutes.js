const express = require("express");
const router = express.Router();

const{
    getAllUsers,
    getUserById,
    deleteUser,
    updateUserStatus,
    updateUserRole,
} = require("../controllers/userController");
const {protect , restrictTo} = require("../middleware/auth");

router.use(protect);
router.use(restrictTo("admin"));

router.get("/",getAllUsers);
router.get("/:id",getUserById);
router.put("/:id/status",updateUserStatus);
router.put("/:id/role",updateUserRole);
router.delete("/:id",deleteUser);

module.exports = router;