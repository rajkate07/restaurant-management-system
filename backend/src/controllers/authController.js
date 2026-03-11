// const AuthService = require('../services/authService');

// exports.register = async (req, res) => {
//   try {
//     const user = await AuthService.register(req.body);
//     res.status(201).json({ message: "User registered successfully", user });
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };

// exports.login = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const { user, token } = await AuthService.login(email, password);

//     res.status(200).json({
//       message: "Login successful",
//       token,
//       user: { id: user.id, name: user.name, email: user.email, role: user.role }
//     });
//   } catch (error) {
//     res.status(401).json({ error: error.message });
//   }
// };


const { User } = require('../models');
const AuthService = require('../services/authService');

exports.registerCustomer = async (req, res) => {
  try {
    const userData = { ...req.body, role: 'customer' };
    const user = await AuthService.register(userData);
    const { token } = await AuthService.login(user.email, req.body.password);

    res.status(201).json({
      success: true,
      token,
      user: { id: user.id, name: user.name, role: user.role }
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// This replaces the public register. Only authenticated Admins can hit this.
exports.addStaff = async (req, res) => {
  try {
    // We add a default password for new staff (e.g., 'staff123') 
    // They can change it later.
    const staffData = { ...req.body, password: 'staff123' };
    const user = await AuthService.register(staffData);

    res.status(201).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { user, token } = await AuthService.login(email, password);

    res.status(200).json({
      success: true,
      token,
      user: { id: user.id, name: user.name, role: user.role }
    });
  } catch (error) {
    res.status(401).json({ success: false, error: error.message });
  }
};

// 1. Get all staff (for the table)
exports.getAllStaff = async (req, res) => {
  try {
    const staff = await User.findAll({
      attributes: { exclude: ['password'] } // Safety first: never send hashes to the table
    });
    res.status(200).json({ success: true, data: staff });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// 2. Update staff details
exports.updateStaff = async (req, res) => {
  try {
    const { id } = req.params;
    const staff = await User.findByPk(id);
    if (!staff) return res.status(404).json({ message: "Staff not found" });

    await staff.update(req.body);
    res.status(200).json({ success: true, data: staff });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// 3. Delete staff (Remove from MySQL)
exports.deleteStaff = async (req, res) => {
  try {
    const { id } = req.params;
    const staff = await User.findByPk(id);
    if (!staff) return res.status(404).json({ message: "Staff not found" });

    await staff.destroy();
    res.status(200).json({ success: true, message: "Staff removed" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};