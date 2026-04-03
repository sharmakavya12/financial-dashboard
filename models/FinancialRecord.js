const mongoose = require("mongoose");

const financialRecordSchema = new mongoose.Schema({
    amount : {
        type : Number,
        required : [true, "please provide an amount"],
        min : [0, "Amount cannot be negative"],
    },
    type : {
        type : String,
        enum : ["income","expense"],
        required : [true, "please provide a type"],
    },
    category : {
        type : String,
        required : [true, "please provide a category"],
        trim : true,
        lowercase : true,
    },
    date : {
        type : Date,
        required : [true, "please provide a date"],
        default : Date.now,
    },
    notes : {
        type : String,
        trim : true,
        default : "",
    },
    createdBy : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true,
    },
    isDeleted : {
        type : Boolean,
        default : false,
    },
},
 {timestamps : true}
);

module.exports = mongoose.model("FinancialRecord", financialRecordSchema);