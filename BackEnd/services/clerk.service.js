const User = require('../models/user');

const upsertUser = async ({ clerkId, email, firstName, lastName }) => {
  const existingUser = await User.findOne({ clerkId });

  let role;
  if (!existingUser) {
    role = 'PLANEUSER';
  } else if (existingUser.role === 'ADMINUSER') {
    role = 'ADMINUSER';
  } else {
    role = existingUser.role;
  }

  return await User.findOneAndUpdate(
    { clerkId },
    { $set: { email, firstName, lastName, role } },
    { upsert: true, new: true }
  );
};

module.exports = { upsertUser };