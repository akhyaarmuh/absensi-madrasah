import Teacher from '../models/Teacher.js';
import { errorValidation } from '../utilities/mongoose.js';

export const createTeacher = async (req, res) => {
  try {
    const newTeacher = new Teacher(req.body);
    await newTeacher.save();

    res.status(201).json({ data: newTeacher, message: 'Mudaris berhasil dibuat' });
  } catch (error) {
    if (error.name === 'ValidationError')
      res.status(400).json({
        message: error.message || 'Data tidak benar',
        error: errorValidation(error),
      });
    else res.status(500).json({ message: error.message || 'Server error', error });
  }
};

export const getAllTeacher = async (req, res) => {
  const url = `${req.protocol}://${req.get('host')}/images`;
  const { page = 0, limit = 0, sort = '', ...query } = req.query;
  const queries = {};
  if (query.full_name) queries.full_name = new RegExp(query.full_name, 'i');
  if (query.no_induk) queries.no_induk = query.no_induk;

  try {
    let data = await Teacher.find(queries).exec();
    const rows = data.length;
    const allPage = Math.ceil(rows ? rows / (limit || rows) : 0);

    data = await Teacher.find(queries)
      .select('-__v')
      .sort(sort)
      .skip(page * limit)
      .limit(limit || rows)
      .exec();

    res.json({ data, page: Number(page), limit: Number(limit), rows, allPage, url });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error', error });
  }
};

export const getTeacherById = async (req, res) => {
  const url = `${req.protocol}://${req.get('host')}/images`;
  const { id: _id } = req.params;

  try {
    const data = await Teacher.findOne({ _id }).select('-__v').exec();

    const teacher = data;
    teacher.url = url;

    res.json({ data: teacher });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error', error });
  }
};

export const updateTeacherById = async (req, res) => {
  const { id: _id } = req.params;
  const payload = req.body;

  try {
    await Teacher.findOneAndUpdate(
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

export const updateStatusById = async (req, res) => {
  const { id: _id } = req.params;

  try {
    const teacher = await Teacher.findOne({ _id }).exec();

    await Teacher.findOneAndUpdate({ _id }, { status: teacher.status ? 0 : 1 }).exec();

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

export const deleteTeacherById = async (req, res) => {
  const { id: _id } = req.params;

  try {
    await Teacher.deleteOne({ _id }).exec();

    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error', error });
  }
};
