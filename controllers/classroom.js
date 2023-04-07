import Classroom from '../models/Classroom.js';
import { errorValidation } from '../utilities/mongoose.js';

export const createClassroom = async (req, res) => {
  try {
    const newClassroom = new Classroom(req.body);
    await newClassroom.save();

    res.status(201).json({ data: newClassroom, message: 'Kelas berhasil dibuat' });
  } catch (error) {
    if (error.name === 'ValidationError')
      res.status(400).json({
        message: error.message || 'Data tidak benar',
        error: errorValidation(error),
      });
    else res.status(500).json({ message: error.message || 'Server error', error });
  }
};

export const getAllClassroom = async (req, res) => {
  const { page = 0, limit = 0, sort = '', ...query } = req.query;
  const queries = {};
  if (query.name) queries.name = new RegExp(query.name, 'i');

  try {
    let data = await Classroom.find(queries).exec();
    const rows = data.length;
    const allPage = Math.ceil(rows ? rows / (limit || rows) : 0);

    data = await Classroom.find(queries)
      .select('-__v')
      .sort(sort)
      .skip(page * limit)
      .limit(limit || rows)
      .exec();

    res.json({ data, page: Number(page), limit: Number(limit), rows, allPage });
  } catch (error) {
    res.status(500).json({ message: error.message, error });
  }
};

export const updateClassroomById = async (req, res) => {
  const { id: _id } = req.params;
  const payload = req.body;

  try {
    await Classroom.findOneAndUpdate(
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
        error: formatterErrorValidation(error),
      });
    else res.status(500).json({ message: error.message || 'Server error', error });
  }
};

export const deleteClassroomById = async (req, res) => {
  const { id: _id } = req.params;

  try {
    await Classroom.deleteOne({ _id }).exec();

    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error', error });
  }
};
