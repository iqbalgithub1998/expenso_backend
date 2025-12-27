import Friend from "../models/Friend.js";

/**
 * @desc Add friend
 * @route POST /api/friends
 */
export const addFriend = async (req, res) => {
  const { name, phone } = req.body;

  const friend = await Friend.create({
    userId: req.user._id,
    name,
    phone,
  });

  const formattedFriend = {
    id: friend._id,
    name: friend.name,
    phone: friend.phone,
    balance: friend.balance,
  };

  res.status(201).json(formattedFriend);
};

/**
 * @desc Get friends
 * @route GET /api/friends
 */
export const getFriends = async (req, res) => {
  const friends = await Friend.find({
    userId: req.user._id,
  }).sort({ updatedAt: -1 });

  const formattedFriends = friends.map((friend) => {
    return {
      id: friend._id,
      name: friend.name,
      phone: friend.phone,
      balance: friend.balance,
    };
  });

  res.json(formattedFriends);
};

/**
 * @desc Delete friend
 * @route DELETE /api/friends/:id
 */
export const deleteFriend = async (req, res) => {
  const friend = await Friend.findOne({
    _id: req.params.id,
    userId: req.user._id,
  });

  if (!friend) {
    return res.status(404).json({ message: "Friend not found" });
  }

  await friend.deleteOne();
  res.json({ message: "Friend deleted" });
};
