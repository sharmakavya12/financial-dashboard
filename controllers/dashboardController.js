const FinancialRecord = require("../models/FinancialRecord");

const getDashboardSummary = async(req,res) => {
    try {

        const baseFilter = {isDeleted : false};
        if (req.user.role === "viewer") {
            baseFilter.createdBy = req.user._id;
        }

        //total income and expenses
        const total = await FinancialRecord.aggregate([
            {$match : baseFilter},
            {
                $group : {
                    _id : "$type",
                    total : {$sum : "$amount"},
                },
            },
        ]);
       
        let totalIncome = 0;
        let totalExpenses = 0;

        total.forEach((item) => {
            if(item._id === "income") totalIncome = item.total;
            if(item._id === "expense") totalExpenses = item.total;
        });
       
         const netBalance = totalIncome - totalExpenses;

        //category-wise breakdown
        const categoryWiseTotals = await FinancialRecord.aggregate([
            {$match : baseFilter},
            {
                $group : {
                    _id : {category : "$category", type : "$type"},
                    totalAmount : {$sum : "$amount"},
                },
            },
            
            {
                $sort : {totalAmount : -1},
            },
        ]);
        //recent activity
        const recentActivity = await FinancialRecord.find(baseFilter).populate("createdBy", "name email").sort({date: -1}).limit(5);

        //monthly trends for last 6 months
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const monthlyTrends = await FinancialRecord.aggregate([
            {
                $match : {
                    ...baseFilter,
                    date : {$gte : sixMonthsAgo},
                },
            },
            {
                $group : {
                    _id : {
                        year : {$year : "$date"},
                        month : {$month : "$date"},
                        type : "$type",
                    },
                    total : {$sum : "$amount"},
                },
            },
            {
                $sort : {"_id.year" : 1, "_id.month" : 1},
            },
        ]);
        
        res.status(200).json({
            success : true,
            data : {
                totalIncome,
                totalExpenses,
                netBalance ,
                categoryWiseTotals,
                recentActivity,
                monthlyTrends,
            },
        });
    } catch (error) {
        res.status(500).json({
            success : false,
            message : "Something went wrong. Please try again.",
        });
    }
};

module.exports = {
    getDashboardSummary,
};