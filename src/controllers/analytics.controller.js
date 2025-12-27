import Expense from "../models/Expense.js";
import Friend from "../models/Friend.js";
import Transaction from "../models/Transacion.js ";

/**
 * @desc Dashboard overview
 * @route GET /api/analytics/overview
 */
export const overviewAnalytics = async (req, res) => {
  const userId = req.user._id;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // 📅 Today's Expense
  const todayExpenseAgg = await Expense.aggregate([
    {
      $match: {
        userId,
        date: { $gte: today },
      },
    },
    {
      $group: {
        _id: null,
        total: { $sum: "$amount" },
      },
    },
  ]);

  const todayExpense = todayExpenseAgg[0]?.total || 0;

  // 🟢 Total Take / 🔴 Total Pay
  const friends = await Friend.find({ userId });

  let totalTake = 0;
  let totalPay = 0;

  friends.forEach((f) => {
    if (f.balance > 0) totalTake += f.balance;
    if (f.balance < 0) totalPay += Math.abs(f.balance);
  });

  res.json({
    todayExpense,
    totalTake,
    totalPay,
    netBalance: totalTake - totalPay,
  });
};

/**
 * @desc Monthly expense graph
 * @route GET /api/analytics/monthly-expense
 */
export const monthlyExpenseAnalytics = async (req, res) => {
  const userId = req.user._id;
  const { month, year } = req.query;

  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 1);

  const data = await Expense.aggregate([
    {
      $match: {
        userId,
        date: { $gte: start, $lt: end },
      },
    },
    {
      $group: {
        _id: { $dayOfMonth: "$date" },
        total: { $sum: "$amount" },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  // Convert to Flutter-friendly map
  const result = {};
  data.forEach((d) => {
    result[d._id] = d.total;
  });

  res.json(result);
};

/**
 * @desc Lend vs Borrow summary
 * @route GET /api/analytics/lend-borrow
 */
export const lendBorrowAnalytics = async (req, res) => {
  const userId = req.user._id;

  const data = await Transaction.aggregate([
    { $match: { userId } },
    {
      $group: {
        _id: "$type",
        total: { $sum: "$amount" },
      },
    },
  ]);

  let lend = 0;
  let borrow = 0;
  let settlement = 0;

  data.forEach((d) => {
    if (d._id === "lend") lend = d.total;
    if (d._id === "borrow") borrow = d.total;
    if (d._id === "settlement") settlement = d.total;
  });

  res.json({
    lend,
    borrow,
    settlement,
  });
};
