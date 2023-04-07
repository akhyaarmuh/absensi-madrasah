import mongoose from 'mongoose';
import Absent from '../models/Absent.js';
import Teacher from '../models/Teacher.js';
import Student from '../models/Student.js';
import Absent_Detail from '../models/Absent_Detail.js';
import { errorValidation } from '../utilities/mongoose.js';
const minimal_hadir = Number(process.env.MINIMAL_HADIR || 30);

const populateQuery = [
  {
    path: 'classroom',
    select: '_id name',
  },
];

export const createAbsent = async (req, res) => {
  try {
    const newAbsent = new Absent();
    await newAbsent.save();

    res.status(201).json({ data: newAbsent, message: 'Buku absent berhasil dibuat' });
  } catch (error) {
    if (error.name === 'ValidationError')
      res.status(400).json({
        message: error.message || 'Data tidak benar',
        error: errorValidation(error),
      });
    else res.status(500).json({ message: error.message || 'Server error', error });
  }
};

export const getAllAbsent = async (req, res) => {
  const { page = 0, limit = 0, sort = '-created_at' } = req.query;

  try {
    let data = await Absent.find().exec();
    const rows = data.length;
    const allPage = Math.ceil(rows ? rows / (limit || rows) : 0);

    data = await Absent.find()
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

export const deleteAbsentById = async (req, res) => {
  const { id: _id } = req.params;

  try {
    await Absent.deleteOne({ _id }).exec();

    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error', error });
  }
};

// detail absent
export const createDetailAbsent = async (req, res) => {
  const url = `${req.protocol}://${req.get('host')}/images`;
  const { id_absent } = req.params;
  const { role, status, no_induk } = req.body;
  let user;
  let newAbsentDetail;

  try {
    if (role === 'teacher') {
      user = await Teacher.findOne({ no_induk }).exec();
    } else if (role === 'student') {
      user = await Student.findOne({ no_induk }).exec();
    } else {
      throw new Error('wrong role link');
    }

    if (!user) return res.status(404).json({ message: 'Pengguna tidak ditemukan' });

    if (role === 'student') {
      newAbsentDetail = new Absent_Detail({
        id_absent,
        id_student: user._id,
        role: 'student',
        status,
      });
    } else if (role === 'teacher') {
      newAbsentDetail = new Absent_Detail({
        id_absent,
        id_teacher: user._id,
        role: 'teacher',
        status: status !== 'hadir' ? status : 'pending',
      });
    }

    await newAbsentDetail.save();

    res.status(201).json({
      data: { ...user._doc, url },
      message: `${user.full_name} berhasil absent`,
    });
  } catch (error) {
    if (error.name === 'ValidationError')
      res.status(400).json({
        message: error.message || 'Data tidak benar',
        error: errorValidation(error),
      });
    else res.status(500).json({ message: error.message || 'Server error', error });
  }
};

export const getUserAbsent = async (req, res) => {
  const { id_absent } = req.params;
  const { role = '' } = req.query;
  let data;

  try {
    if (role === 'student') {
      data = await Student.aggregate([
        {
          $lookup: {
            from: 'absent_details',
            localField: '_id',
            foreignField: 'id_student',
            as: 'absences',
            pipeline: [
              {
                $match: {
                  id_absent: new mongoose.Types.ObjectId(id_absent),
                },
              },
            ],
          },
        },
        {
          $match: {
            'absences.status': { $ne: 'hadir' },
          },
        },
        {
          $project: {
            no_induk: 1,
            full_name: 1,
            parent_name: 1,
            address: 1,
            classroom: 1,
            status: '$absences.status',
          },
        },
        {
          $sort: { classroom: 1, full_name: 1 },
        },
      ]).exec();

      data = await Student.populate(data, populateQuery);
    } else if (role === 'teacher') {
      data = await Teacher.aggregate([
        {
          $lookup: {
            from: 'absent_details',
            localField: '_id',
            foreignField: 'id_teacher',
            as: 'absences',
            pipeline: [
              {
                $match: {
                  id_absent: new mongoose.Types.ObjectId(id_absent),
                },
              },
            ],
          },
        },
        {
          $match: {
            'absences.status': { $ne: 'hadir' },
          },
        },
        {
          $project: {
            no_induk: 1,
            full_name: 1,
            parent_name: 1,
            address: 1,
            status: '$absences.status',
          },
        },
        {
          $sort: { full_name: 1 },
        },
      ]).exec();
    } else {
      return res.status(400).json({ message: 'Anda tidak mengirimkan role query' });
    }

    res.json({ data, rows: data.length });
  } catch (error) {
    res.status(500).json({ message: error.message, error });
  }
};

export const updateDetailAbsentByNoInduk = async (req, res) => {
  const url = `${req.protocol}://${req.get('host')}/images`;
  const { id_absent } = req.params;
  const { no_induk } = req.body;

  try {
    const user = await Teacher.findOne({ no_induk }).exec();
    if (!user) return res.status(404).json({ message: 'Pengguna tidak ditemukan' });

    const absent_hadir = await Absent_Detail.findOne({
      id_absent,
      id_teacher: user._id,
    }).exec();
    if (!absent_hadir)
      return res.status(404).json({ message: 'Anda belum melakukan absen hadir' });
    if (absent_hadir.out)
      return res.status(404).json({ message: 'Anda sudah melakukan absen pulang' });

    const now = new Date();
    const _in = new Date(absent_hadir.in);
    const status =
      now.getTime() > _in.getTime() + minimal_hadir * 60000 ? 'hadir' : 'lebih awal';

    await Absent_Detail.findOneAndUpdate(
      { _id: absent_hadir._id },
      {
        out: now,
        status: absent_hadir.status === 'pending' ? status : absent_hadir.status,
      }
    );

    res.json({ data: { ...user._doc, url } });
  } catch (error) {
    if (error.name === 'ValidationError')
      res.status(400).json({
        message: error.message || 'Data tidak benar',
        error: formatterErrorValidation(error),
      });
    else res.status(500).json({ message: error.message || 'Server error', error });
  }
};
