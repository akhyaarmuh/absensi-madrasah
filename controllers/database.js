import path from 'path';

import Absent_Detail from '../models/Absent_Detail.js';
import Absent from '../models/Absent.js';
import Classroom from '../models/Classroom.js';
import Student from '../models/Student.js';
import Teacher from '../models/Teacher.js';
import User from '../models/User.js';
import { __dirname } from '../utilities/index.js';
import { restoreDatabase, errorValidation } from '../utilities/mongoose.js';

export const restore = async (req, res) => {
  const backup = req.files?.backup;

  try {
    const ext = path.extname(backup.name);

    if (!backup)
      throw {
        name: 'ValidationError',
        message: 'File tidak benar',
        errors: { file: { message: 'File tidak boleh kosong' } },
      };

    // cek extensi yang diizinkan
    if (ext.toLowerCase() !== '.json')
      throw {
        name: 'ValidationError',
        message: 'File tidak benar',
        errors: { file: { message: 'File yang diizinkan (.json)' } },
      };

    const fileName = 'backup' + ext;

    backup.mv(`${__dirname}/${fileName}`, async (error) => {
      if (error) throw error;

      await Absent_Detail.collection.drop();
      await Absent.collection.drop();
      await Classroom.collection.drop();
      await Student.collection.drop();
      await Teacher.collection.drop();
      await User.collection.drop();

      await restoreDatabase();
    });

    res.sendStatus(200);
  } catch (error) {
    if (error.name === 'ValidationError')
      res.status(400).json({
        message: error.message || 'Data tidak benar',
        error: errorValidation(error),
      });
    else res.status(500).json({ message: error.message || 'Server error', error });
  }
};
