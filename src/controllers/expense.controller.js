import Expense from "../models/Expense.js";

/**
 * @desc Add expense
 * @route POST /api/expenses
 */
export const addExpense = async (req, res) => {
  const { amount, category, description, date } = req.body;

  const expense = await Expense.create({
    userId: req.user._id,
    amount,
    category,
    description,
    date,
  });

  res.status(201).json(expense);
};

// /**
//  * @desc Get all expenses
//  * @route GET /api/expenses
//  */
// export const getExpenses = async (req, res) => {
//   const expenses = await Expense.find({
//     userId: req.user._id,
//   }).sort({ date: -1 });
//   const formattedData = expenses.map((expense) => {
//     return {
//       id: expense._id,
//       amount: expense.amount,
//       category: expense.category,
//       description: expense.description,
//       date: expense.date,
//     };
//   });
//   res.json(formattedData);
// };

/**
 * @desc Get all expenses with optional month filtering
 * @route GET /api/expenses?month=2026-01
 */
export const getExpenses = async (req, res) => {
  try {
    const { month } = req.query;
    console.log(month);
    // Bui  ld date filter
    let dateFilter = {};

    if (month) {
      // If month is provided (format: YYYY-MM)
      const [year, monthNum] = month.split("-");
      const startDate = new Date(year, monthNum - 1, 1);
      const endDate = new Date(year, monthNum, 0, 23, 59, 59, 999);

      dateFilter = {
        date: {
          $gte: startDate,
          $lte: endDate,
        },
      };
    } else {
      // Default to current month
      const now = new Date();
      const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      const endDate = new Date(
        now.getFullYear(),
        now.getMonth() + 1,
        0,
        23,
        59,
        59,
        999
      );

      dateFilter = {
        date: {
          $gte: startDate,
          $lte: endDate,
        },
      };
    }

    // Fetch expenses
    const expenses = await Expense.find({
      userId: req.user._id,
      ...dateFilter,
    }).sort({ date: -1 });

    // Calculate total for the month
    const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);

    // Format response
    const formattedData = expenses.map((expense) => ({
      id: expense._id,
      amount: expense.amount,
      category: expense.category,
      description: expense.description,
      date: expense.date,
    }));

    res.json({
      expenses: formattedData,
      total: total,
      month:
        month ||
        `${new Date().getFullYear()}-${String(
          new Date().getMonth() + 1
        ).padStart(2, "0")}`,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc Delete expense
 * @route DELETE /api/expenses/:id
 */
export const deleteExpense = async (req, res) => {
  const expense = await Expense.findOne({
    _id: req.params.id,
    userId: req.user._id,
  });

  if (!expense) {
    return res.status(404).json({ message: "Expense not found" });
  }

  await expense.deleteOne();
  res.json({ message: "Expense removed" });
};

/**
 * @desc Monthly expense analytics
 * @route GET /api/expenses/monthly
 */
export const monthlyExpense = async (req, res) => {
  const { month, year } = req.query;

  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 1);

  const expenses = await Expense.find({
    userId: req.user._id,
    date: { $gte: start, $lt: end },
  });

  // Group by day
  const dailyTotals = {};
  expenses.forEach((e) => {
    const day = new Date(e.date).getDate();
    dailyTotals[day] = (dailyTotals[day] || 0) + e.amount;
  });

  res.json(dailyTotals);
};
