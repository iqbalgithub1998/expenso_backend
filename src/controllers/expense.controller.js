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

/**
 * @desc Get all expenses
 * @route GET /api/expenses
 */
export const getExpenses = async (req, res) => {
  const expenses = await Expense.find({
    userId: req.user._id,
  }).sort({ date: -1 });
  const formattedData = expenses.map((expense) => {
    return {
      id: expense._id,
      amount: expense.amount,
      category: expense.category,
      description: expense.description,
      date: expense.date,
    };
  });
  res.json(formattedData);
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
