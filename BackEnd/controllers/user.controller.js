const { getUsers, getUserById, getMyProfile, updateProfile, createUserByAdmin, updateUserProfileByAdmin, getRoles, changeUserRole, banUser } = require('../services/user.service');

const fetchUsers = async (req, res) => {
  try {
    const users = await getUsers();
    res.status(200).json({ success: true, users });
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};

const fetchUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await getUserById(id);
    res.status(200).json({ success: true, user });
  } catch (error) {
    if (error.status === 400) {
      return res.status(400).json({ error: error.message });
    }
    if (error.status === 404) {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};

const fetchRoles = async (req, res) => {
  try {
    const roles = await getRoles();
    res.status(200).json({ success: true, roles });
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};

const updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    const user = await changeUserRole(id, role, req.dbUser._id);
    res.status(200).json({ success: true, user });
  } catch (error) {
    if (error.status === 400) {
      return res.status(400).json({ error: error.message });
    }
    if (error.status === 403) {
      return res.status(403).json({ error: error.message });
    }
    if (error.status === 404) {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};

const updateBan = async (req, res) => {
  try {
    const { id } = req.params;
    const { isBanned } = req.body;

    const user = await banUser(id, isBanned, req.dbUser._id);
    res.status(200).json({ success: true, user });
  } catch (error) {
    if (error.status === 400) {
      return res.status(400).json({ error: error.message });
    }
    if (error.status === 403) {
      return res.status(403).json({ error: error.message });
    }
    if (error.status === 404) {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};

const fetchMyProfile = async (req, res) => {
  try {
    const user = await getMyProfile(req.dbUser._id);
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};

const patchProfile = async (req, res) => {
  try {
    const user = await updateProfile(req.dbUser._id, req.body);
    res.status(200).json({ success: true, user });
  } catch (error) {
    if (error.status === 400) return res.status(400).json({ error: error.message, details: error.details });
    if (error.status === 404) return res.status(404).json({ error: error.message });
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};

const createUser = async (req, res) => {
  try {
    const user = await createUserByAdmin(req.body);
    res.status(201).json({ success: true, user });
  } catch (error) {
    if (error.status === 400) return res.status(400).json({ error: error.message, details: error.details });
    if (error.status === 403) return res.status(403).json({ error: error.message });
    if (error.status === 404) return res.status(404).json({ error: error.message });
    if (error.status === 409) return res.status(409).json({ error: error.message });
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};

const patchUserProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await updateUserProfileByAdmin(id, req.body);
    res.status(200).json({ success: true, user });
  } catch (error) {
    if (error.status === 400) return res.status(400).json({ error: error.message, details: error.details });
    if (error.status === 404) return res.status(404).json({ error: error.message });
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};

module.exports = { fetchUsers, fetchUserById, fetchMyProfile, patchProfile, createUser, patchUserProfile, fetchRoles, updateRole, updateBan };