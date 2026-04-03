const mongoose = require("mongoose");
const FinancialRecord = require("../models/FinancialRecord");

// Create new financial record
const createRecord = async (req,res) => {
    try {
        const {amount,category,date,notes,type} = req.body;

        const record = await FinancialRecord.create({
            amount,
            category:category?.toLowerCase(),
            date : date || Date.now(),
            notes,
            type,
            createdBy : req.user.id,
        });
        res.status(201).json({
            success : true,
            message : "Financial record created successfully.",
            record,
        });
    } catch (error) {
        res.status(500).json({
            success : false,
            message : "Something went wrong. Please try again.",
        });
    }
};


// Get all records with pagination and filtering
const getAllRecords = async(req,res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const filter = {isDeleted : false };
        if (req.user.role === "viewer") {
            filter.createdBy = req.user._id; 
            }
        if(req.query.type){
            filter.type = req.query.type;
        }
        if(req.query.category){
            filter.category = req.query.category.toLowerCase();
        }
        if(req.query.startDate || req.query.endDate){
            filter.date = {};
            if(req.query.startDate){
                filter.date.$gte = new Date(req.query.startDate);
            }
            if(req.query.endDate){
                filter.date.$lte = new Date(req.query.endDate);
            }
        }

        const totalRecords = await FinancialRecord.countDocuments(filter);
        const records = await FinancialRecord.find(filter)
            .populate("createdBy", "name email")
            .sort({date : -1})
            .skip(skip)
            .limit(limit);
        
        res.status(200).json({
            success : true,
            count : records.length,
            total : totalRecords,
            totalPages : Math.ceil(totalRecords / limit),
            currentPage : page,
            records,
        });
    } catch (error) {
        res.status(500).json({
            success : false,
            message : "Something went wrong. Please try again.",
        });
    }
};

// Get record by ID
const getRecordById = async(req,res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid record ID.",
            });
        }
        
      const filter = { _id: req.params.id, isDeleted: false };
          if (req.user.role === "viewer") {
              filter.createdBy = req.user._id;
            }

      const record = await FinancialRecord.findOne(filter).populate("createdBy", "name email");

        if(!record){
            return res.status(404).json({
                success : false,
                message : "Financial record not found.",
            });
        }

        res.status(200).json({
            success : true,
            record,
        });
    }
    catch(error){
        res.status(500).json({
            success : false,
            message : "Something went wrong. Please try again.",
        });
    }
};


// Update record
const updateRecord = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid record ID.",
      });
    }

    const { amount, type, category, date, notes } = req.body;

    const updateData = {};
    if (amount !== undefined) updateData.amount = amount;
    if (type) updateData.type = type;
    if (category) updateData.category = category.toLowerCase();
    if (date) updateData.date = date;
    if (notes !== undefined) updateData.notes = notes;

    // FILTER (security + syntax)
    const filter = { _id: req.params.id, isDeleted: false };

    if (req.user.role === "viewer") {
      filter.createdBy = req.user._id;
    }

    const record = await FinancialRecord.findOneAndUpdate(
      filter,
      updateData,
      { new: true, runValidators: true }
    );

    if (!record) {
      return res.status(404).json({
        success: false,
        message: "Financial record not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Financial record updated successfully.",
      record,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again.",
    });
  }
};

// Soft delete record
const deleteRecord = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid record ID.",
      });
    }

    const filter = { _id: req.params.id, isDeleted: false };

    if (req.user.role === "viewer") {
      filter.createdBy = req.user._id;
    }

    const record = await FinancialRecord.findOneAndUpdate(
      filter,
      { isDeleted: true },
      { new: true }
    );

    if (!record) {
      return res.status(404).json({
        success: false,
        message: "Record not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Financial record deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again.",
    });
  }
};

module.exports = {
    createRecord,
    getAllRecords,
    getRecordById,
    updateRecord,
    deleteRecord,
};