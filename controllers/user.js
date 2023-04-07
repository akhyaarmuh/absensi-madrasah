import User from '../models/User.js';
import { errorValidation } from '../utilities/mongoose.js';

// create user
export const createUser = async (req, res) => {
  const newUser = new User(req.body);

  try {
    await newUser.save();
    res.status(201).json({ data: newUser });
  } catch (error) {
    if (error.name === 'ValidationError')
      res.status(400).json({
        message: error.message || 'Data tidak benar',
        error: errorValidation(error),
      });
    else res.status(500).json({ message: error.message || 'Server error', error });
  }
};

// get all user
export const getAllUser = async (req, res) => {
  const { page = 0, limit = 0, sort = '', ...query } = req.query;
  const queries = {};
  if (query.full_name) queries.full_name = new RegExp(query.full_name, 'i');
  if (query.email) queries.email = email;

  try {
    let data = await User.find(queries).exec();
    const rows = data.length;
    const allPage = Math.ceil(rows ? rows / (limit || rows) : 0);

    data = await User.find(queries)
      .select('-password -refresh_token -__v')
      .sort(sort)
      .skip(page * limit)
      .limit(limit || rows)
      .exec();

    res.json({ data, page: Number(page), limit: Number(limit), rows, allPage });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error', error });
  }
};

// get user by id
export const getUserById = async (req, res) => {
  const { id: _id } = req.params;

  try {
    const data = await User.findOne({ _id }, '-password -refresh_token -__v').exec();

    if (!data) return res.status(404).json({ message: 'Data tidak ditemukan' });

    res.json({ data });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error', error });
  }
};

// update user by id
export const updateUserById = async (req, res) => {
  const { id: _id } = req.params;
  const payload = req.body;

  try {
    await User.findOneAndUpdate(
      { _id },
      { ...payload, _id },
      {
        runValidators: true,
      }
    ).exec();

    res.json({ data: payload });
  } catch (error) {
    if (error.name === 'ValidationError')
      res.status(400).json({
        message: error.message || 'Data tidak benar',
        error: errorValidation(error),
      });
    else res.status(500).json({ message: error.message || 'Server error', error });
  }
};

// update password by id
export const updatePasswordById = async (req, res) => {
  const { id: _id } = req.params;

  try {
    const user = await User.findOne({ _id }).exec();

    user.set('password', req.body.password);
    await user.save();

    res.sendStatus(204);
  } catch (error) {
    if (error.name === 'ValidationError')
      res.status(400).json({
        message: error.message || 'Data tidak benar',
        error: errorValidation(error),
      });
    else res.status(500).json({ message: error.message || 'Server error', error });
  }
};

// update status by id
export const updateStatusdById = async (req, res) => {
  const { id: _id } = req.params;

  try {
    const user = await User.findOne({ _id }).exec();

    await User.findOneAndUpdate({ _id }, { status: user.status ? 0 : 1 }).exec();

    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error', error });
  }
};

// delete user by id
export const deleteUserById = async (req, res) => {
  const { id: _id } = req.params;

  try {
    await User.deleteOne({ _id }).exec();
    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error', error });
  }
};
