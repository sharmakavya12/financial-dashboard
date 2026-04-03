const User = require("../models/User");
const mongoose = require("mongoose");

const getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const totalUsers = await User.countDocuments();
    const users = await User.find()
      .skip(skip)        
      .limit(limit)    
      .select("-password");

    res.status(200).json({
      success: true,
      count: users.length,
      total: totalUsers,
      totalPages: Math.ceil(totalUsers / limit),
      currentPage: page,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again.",
    });
  }
};

  const getUserById = async(req,res) => {
    try{
        
         if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
             return res.status(400).json({
                 success: false,
                  message: "Invalid user ID.",
      });
    }

        const user = await User.findById(req.params.id).select("-password");

        if(!user){
            return res.status(404).json({
                success : false,
                message : "User not found",

            });
        }
        res.status(200).json({
            success : true,
            user,
        });
    }
    catch(error){
        res.status(500).json({
            success : false,
            message : "Something went wrong. Please try again.",
        });
    }
};

const updateUserRole = async(req,res) => {
    try {
        const {role} = req.body;

        if(!["viewer","analyst","admin"].includes(role)){
            return res.status(400).json({
                success : false,
                message : "Invalid role. Role must be viewer, analyst, or admin.",
            });
        }
        if(req.params.id === req.user._id.toString()){
            return res.status(400).json({
                success: false,
                message : "You cannot change your own role.",

            });
        }
        const user = await User.findByIdAndUpdate(
            req.params.id,
            {role},
            {new : true}
        ).select("-password");

        if(!user){
            return res.status(404).json({
                success : false,
                message : "User not found.",
            });
        
    }

    res.status(200).json({
        success : true,
        message : `User role updated successfully to ${role}.`,
        user,
    });
    }
    catch(error){
        res.status(500).json({
            success : false,
            message : "Something went wrong. Please try again.",
        });

    }
};

const updateUserStatus = async(req,res) => {
    try {
        const {status} = req.body;

        if(!["active","inactive"].includes(status)){
            return res.status(400).json({
                success : false,
                message : "Invalid status. Status must be active or inactive.",
            });
        }

        if(req.params.id === req.user._id.toString()){
            return res.status(400).json({
                success: false,
                message : "You cannot change your own status.",
            });
        }

        const user = await User.findByIdAndUpdate(
            req.params.id,
            {status},
            {new : true}
        ).select("-password");
        
        if(!user){
            return res.status(404).json({
                success : false,
                message : "User not found.",
            });
        }

        res.status(200).json({
            success : true,
            message : `User status updated successfully to ${status}.`,
            user,
        });
    }
    catch(error){
        res.status(500).json({
            success : false,
            message : "Something went wrong. Please try again.",
        });
    }
};

const deleteUser = async(req,res) => {
    try{
        if(req.params.id === req.user._id.toString()){
            return res.status(400).json({
                success : false,
                message : "You cannot delete your own account.",
            });
        }
        const user = await User.findByIdAndDelete(req.params.id);
        
        if(!user){
            return res.status(404).json({
                success : false,
                message : "User not found.",
            });
        }
        res.status(200).json({
            success : true,
            message : "User deleted successfully.",
        });
    }
    catch(error){
        res.status(500).json({
            success : false,    
            message : "Something went wrong. Please try again.",
        });
    }
};
module.exports = {
    getAllUsers,
    getUserById,
    updateUserRole,
    updateUserStatus,
    deleteUser,
};
