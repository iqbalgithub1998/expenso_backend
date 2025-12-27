import mongoose from "mongoose";
import Transaction from "../models/Transacion.js";
import Friend from "../models/Friend.js";

/**
 * @desc Add transaction (lend / borrow / settlement)
 * @route POST /api/transactions
 */
export const addTransaction = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { friendId, amount, type, date, note } = req.body;

    const friend = await Friend.findOne({
      _id: friendId,
      userId: req.user._id,
    }).session(session);

    if (!friend) {
      throw new Error("Friend not found");
    }

    // Save transaction
    const transaction = await Transaction.create(
      [
        {
          userId: req.user._id,
          friendId,
          amount,
          type,
          note,
          date,
        },
      ],
      { session }
    );

    // 🔥 BALANCE LOGIC (SERVER SOURCE OF TRUTH)
    if (type === "lend") {
      friend.balance += amount; // you will take
    } else if (type === "borrow") {
      friend.balance -= amount; // you will pay
    } else if (type === "settlement") {
      if (friend.balance > 0) {
        friend.balance -= amount;
      } else {
        friend.balance += amount;
      }
    }

    await friend.save({ session });

    await session.commitTransaction();
    session.endSession();
    const formattedToken = {
      id: transaction[0]._id,
      friendId: transaction[0].friendId,
      amount: transaction[0].amount,
      type: transaction[0].type,
      note: transaction[0].note,
      date: transaction[0].date,
    };
    res.status(201).json({
      transaction: formattedToken,
      updatedBalance: friend.balance,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(400).json({ message: error.message });
  }
};

/**
 * @desc Get transactions of a friend
 * @route GET /api/transactions/:friendId
 */
export const getTransactionsByFriend = async (req, res) => {
  const transactions = await Transaction.find({
    userId: req.user._id,
    friendId: req.params.friendId,
  }).sort({ date: -1 });
  const formattedData = transactions.map((transaction) => {
    return {
      id: transaction._id,
      friendId: transaction.friendId,
      amount: transaction.amount,
      type: transaction.type,
      note: transaction.note,
      date: transaction.date,
    };
  });
  res.json(formattedData);
};
