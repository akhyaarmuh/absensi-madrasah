import Student from '../models/Student.js';
import { errorValidation } from '../utilities/mongoose.js';

export const createStudent = async (req, res) => {
  try {
    const newStudent = new Student(req.body);
    await newStudent.save();

    res.status(201).json({ data: newStudent, message: 'Santri berhasil dibuat' });
  } catch (error) {
    if (error.name === 'ValidationError')
      res.status(400).json({
        message: error.message || 'Data tidak benar',
        error: errorValidation(error),
      });
    else res.status(500).json({ message: error.message || 'Server error', error });
  }
};

export const getAllStudent = async (req, res) => {
  const url = `${req.protocol}://${req.get('host')}/images`;
  const { page = 0, limit = 0, sort = '', ...query } = req.query;
  const queries = {};
  if (query.gender) queries.gender = query.gender;
  if (query.classroom) queries.classroom = query.classroom;
  if (query.full_name) queries.full_name = new RegExp(query.full_name, 'i');
  if (query.no_induk) queries.no_induk = query.no_induk;
  if (query.status) queries.status = query.status;

  try {
    let data = await Student.find(queries).exec();
    const rows = data.length;
    const allPage = Math.ceil(rows ? rows / (limit || rows) : 0);

    data = await Student.find(queries)
      .select('-__v')
      .populate('classroom', 'name')
      .sort(sort)
      .skip(page * limit)
      .limit(limit || rows)
      .exec();

    res.json({ data, page: Number(page), limit: Number(limit), rows, allPage, url });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error', error });
  }
};

export const getStudentById = async (req, res) => {
  const url = `${req.protocol}://${req.get('host')}/images`;
  const { id: _id } = req.params;

  try {
    const data = await Student.findOne({ _id })
      .select('-__v')
      .populate('classroom', 'name')
      .exec();

    const student = data;
    student.url = url;

    res.json({ data: student });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error', error });
  }
};

export const updateStudentById = async (req, res) => {
  const { id: _id } = req.params;
  const payload = req.body;

  try {
    await Student.findOneAndUpdate(
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
    const student = await Student.findOne({ _id }).exec();

    await Student.findOneAndUpdate({ _id }, { status: student.status ? 0 : 1 }).exec();

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

export const deleteStudentById = async (req, res) => {
  const { id: _id } = req.params;

  try {
    await Student.deleteOne({ _id }).exec();

    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error', error });
  }
};
