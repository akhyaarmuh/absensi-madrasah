import fs from 'fs';
import path from 'path';
import { __dirname } from '../utilities/index.js';
import Teacher from '../models/Teacher.js';
import Student from '../models/Student.js';

const allowedType = ['.png', '.jpg', '.jpeg'];

export const uploadProfile = async (req, res) => {
  const image = req.files?.image;
  const { id: _id } = req.params;

  try {
    const ext = path.extname(image.name);
    if (!image)
      throw {
        name: 'ValidationError',
        message: 'Gambar tidak valid',
        errors: { image: 'Gambar tidak boleh kosong' },
      };

    if (!allowedType.includes(ext.toLowerCase()))
      // cek extensi yang diizinkan
      throw {
        name: 'ValidationError',
        message: 'Gambar tidak valid',
        errors: { image: 'File yang diizinkan (.png, .jpg, .jpeg)' },
      };

    // cek ukuran gambar
    if (image.size > 3000000)
      throw {
        name: 'ValidationError',
        message: 'Gambar tidak valid',
        errors: { image: 'File terlalu besar (Maksimal 3 MB)' },
      };

    const fileName = new Date().getTime() + ext;

    await image.mv(`${__dirname}/public/images/${fileName}`);

    let oldData;

    if (req.body.model === 'Teacher') {
      oldData = await Teacher.findOne({ _id }).exec();
      await Teacher.findOneAndUpdate({ _id }, { image: fileName }).exec();
    } else if (req.body.model === 'Student') {
      oldData = await Student.findOne({ _id }).exec();
      await Student.findOneAndUpdate({ _id }, { image: fileName }).exec();
    }

    if (oldData.image) fs.unlinkSync(`${__dirname}/public/images/${oldData.image}`);

    res.json({ fileName });
  } catch (error) {
    if (error.name === 'ValidationError')
      res.status(400).json({
        message: error.message || 'Gambar tidak valid',
        error: error.errors,
      });
    else res.status(500).json({ message: error.message || 'Server error', error });
  }
};

export const deleteProfile = async (req, res) => {
  const { id: _id, model } = req.params;

  try {
    let oldData;

    if (model === 'Teacher') {
      oldData = await Teacher.findOne({ _id }).exec();
      if (oldData.image) fs.unlinkSync(`${__dirname}/public/images/${oldData.image}`);
      await Teacher.findOneAndUpdate({ _id }, { image: '' }).exec();
    } else if (model === 'Student') {
      oldData = await Student.findOne({ _id }).exec();
      if (oldData.image) fs.unlinkSync(`${__dirname}/public/images/${oldData.image}`);
      await Student.findOneAndUpdate({ _id }, { image: '' }).exec();
    }

    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error', error });
  }
};
